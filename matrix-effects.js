(() => {
  'use strict';
  const $=s=>document.querySelector(s),text=s=>window.siteText(s);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const paused=()=>document.body.classList.contains('motion-paused');
  const announce=message=>{$('#matrix-status').textContent=text(message);};
  const status=document.createElement('p');status.id='matrix-status';status.className='sr-only';status.setAttribute('role','status');document.body.append(status);
  const visionButton=document.createElement('button');visionButton.id='vision-toggle';visionButton.type='button';visionButton.setAttribute('aria-pressed','false');visionButton.setAttribute('aria-label','Удерживай, чтобы видеть код. Клавиша V.');visionButton.innerHTML='◉ <span>КОД</span> <kbd>V</kbd>';
  $('.system-controls .command-trigger').before(visionButton);
  const rain=document.createElement('canvas');rain.id='code-rain';rain.setAttribute('aria-hidden','true');document.body.append(rain);
  let vision=false,heldPointer=null,heldKey=false,latched=false,blocked=false,raf=0,last=0,time=0,gl=null,program,uniforms={},buffer,texture,vertices=[],ctx=null,forceFallback=false;
  function initRain(){
    if(forceFallback)return;
    try{
      gl=rain.getContext('webgl',{alpha:true,antialias:false,depth:false,premultipliedAlpha:true});
      if(!gl){ctx=rain.getContext('2d');rain.dataset.renderer=ctx?'canvas-fallback':'static-fallback';return;}
      const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
      const vs=compile(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aCell;uniform vec2 uResolution;uniform float uTime;uniform mediump float uGlyphs;varying mediump float vGlyph,vAlpha,vHead;float hash(float n){return fract(sin(n*127.1)*43758.5453);}void main(){float rows=ceil(uResolution.y/19.0)+12.0;float speed=3.0+hash(aCell.x)*6.0;float head=mod(uTime*speed+hash(aCell.x+8.0)*rows,rows);float trail=mod(head-aCell.y+rows,rows);float alpha=exp(-trail*.16);vHead=1.0-step(1.1,trail);vAlpha=alpha*.85+.035;vGlyph=floor(hash(aCell.x*31.0+aCell.y*17.0+floor(uTime*(1.0+hash(aCell.y)*2.0)))*uGlyphs);vec2 point=(aCell+.5)*vec2(17.0,19.0);gl_Position=vec4(point/uResolution*vec2(2.0,-2.0)+vec2(-1.0,1.0),0.0,1.0);gl_PointSize=18.0;}`);
      const fs=compile(gl.FRAGMENT_SHADER,`precision mediump float;uniform sampler2D uAtlas;uniform mediump float uGlyphs;varying mediump float vGlyph,vAlpha,vHead;void main(){vec2 uv=vec2((vGlyph+gl_PointCoord.x)/uGlyphs,(4.0+gl_PointCoord.y)/5.0);float a=texture2D(uAtlas,uv).a*vAlpha;if(a<.01)discard;vec3 color=mix(vec3(.23,.95,.38),vec3(.82,1.0,.85),vHead);gl_FragColor=vec4(color*a,a);}`);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const loc=gl.getAttribLocation(program,'aCell');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      for(const name of ['Resolution','Time','Glyphs','Atlas'])uniforms[name]=gl.getUniformLocation(program,'u'+name);
      texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,RenderKit.atlas(false));gl.uniform1i(uniforms.Atlas,0);gl.uniform1f(uniforms.Glyphs,RenderKit.glyphs.length);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
      rain.dataset.renderer='webgl';
    }catch(error){console.warn('Code vision uses its static fallback.',error);gl=null;forceFallback=true;rain.dataset.renderer='static-fallback';}
  }
  function resizeRain(){
    rain.width=Math.max(1,innerWidth);rain.height=Math.max(1,innerHeight);vertices=[];
    for(let x=0;x<Math.ceil(rain.width/17);x++)for(let y=0;y<Math.ceil(rain.height/19);y++)vertices.push(x,y);
    if(gl){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);}if(vision)drawRain();
  }
  function drawRain(){
    if(!vision)return;const start=RenderKit.profile?performance.now():0;
    if(gl){gl.viewport(0,0,rain.width,rain.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform2f(uniforms.Resolution,rain.width,rain.height);gl.uniform1f(uniforms.Time,time);gl.drawArrays(gl.POINTS,0,vertices.length/2);}
    else if(ctx){ctx.clearRect(0,0,rain.width,rain.height);for(let i=0;i<vertices.length;i+=2){const x=vertices[i],y=vertices[i+1],rows=Math.ceil(rain.height/19)+12,head=(time*(3+x%6)+x*7)%rows,trail=(head-y+rows)%rows;RenderKit.glyph(ctx,(x*7+y*13+Math.floor(time*2))%RenderKit.glyphs.length,(x+.5)*17,(y+.5)*19,12,Math.exp(-trail*.16)*.8+.03);}}
    if(RenderKit.profile)RenderKit.record('vision',performance.now()-start);
  }
  function tick(now){raf=0;if(!vision||paused()||document.hidden||blocked)return;if(now-last>=1000/30-1){time+=Math.min((now-last)/1000,.1);last=now;drawRain();}scheduleRain();}
  function scheduleRain(){if(vision&&!paused()&&!document.hidden&&!blocked&&!raf){if(!last)last=performance.now();raf=requestAnimationFrame(tick);}}
  function setVision(next){
    if(next===vision)return;vision=next;
    if(next){endBullet();if(!gl&&!ctx&&!forceFallback){initRain();resizeRain();}}
    document.body.classList.toggle('code-vision',vision);visionButton.setAttribute('aria-pressed',String(vision));
    window.dispatchEvent(new CustomEvent('site:vision',{detail:{active:vision}}));
    if(vision){drawRain();last=performance.now();scheduleRain();}else{cancelAnimationFrame(raf);raf=0;RenderKit.flush();}
  }
  function releaseVision(){heldPointer=null;heldKey=false;latched=false;setVision(false);}
  visionButton.addEventListener('pointerdown',e=>{if(e.button!==0)return;heldPointer=e.pointerId;visionButton.setPointerCapture(e.pointerId);setVision(true);});
  const pointerEnd=e=>{if(e.pointerId!==heldPointer)return;heldPointer=null;setVision(heldKey||latched);};
  visionButton.addEventListener('pointerup',pointerEnd);visionButton.addEventListener('pointercancel',pointerEnd);visionButton.addEventListener('lostpointercapture',pointerEnd);
  visionButton.addEventListener('contextmenu',e=>e.preventDefault());
  visionButton.addEventListener('click',e=>{if(e.detail===0){latched=!latched;setVision(latched);}});
  rain.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;gl=null;rain.dataset.renderer='context-lost';});
  rain.addEventListener('webglcontextrestored',()=>{initRain();resizeRain();last=performance.now();scheduleRain();});
  addEventListener('resize',()=>{if(vision)resizeRain();});

  const actions=document.createElement('div');actions.className='matrix-actions';actions.innerHTML='<button type="button" id="bullet-toggle" aria-pressed="false">◴ BULLET TIME <kbd>SPACE</kbd></button><span class="bullet-readout" aria-hidden="true">TIME × 0.06 / CAMERA ONLINE</span>';$('#construct').append(actions);
  const bulletButton=$('#bullet-toggle');let bullet=false,bulletTimer=0,heroVisible=true;
  function endBullet(){clearTimeout(bulletTimer);if(!bullet)return;bullet=false;bulletButton.setAttribute('aria-pressed','false');document.body.classList.remove('bullet-time');window.dispatchEvent(new CustomEvent('site:bullet',{detail:{active:false}}));}
  function startBullet(){
    if(bullet){endBullet();return;}
    if(paused()||reduced.matches){announce('Включи анимации, чтобы запустить bullet time.');return;}
    if(!heroVisible||blocked)return;
    releaseVision();bullet=true;bulletButton.setAttribute('aria-pressed','true');document.body.classList.add('bullet-time');window.dispatchEvent(new CustomEvent('site:bullet',{detail:{active:true}}));announce('Bullet time. Время замедлено.');bulletTimer=setTimeout(endBullet,4200);
  }
  bulletButton.addEventListener('click',startBullet);
  new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(!heroVisible)endBullet();},{threshold:.15}).observe($('#core'));
  const editing=()=>!!document.activeElement.closest('input,textarea,select,[contenteditable="true"]');
  addEventListener('keydown',e=>{
    if(editing()||e.ctrlKey||e.metaKey||e.altKey||blocked)return;
    if(e.code==='KeyV'&&!e.repeat){e.preventDefault();heldKey=true;setVision(true);}
    if(e.code==='Space'&&!e.repeat&&heroVisible&&!document.activeElement.closest('button,a')){e.preventDefault();startBullet();}
    if(e.key==='Escape'){releaseVision();endBullet();}
  });
  addEventListener('keyup',e=>{if(e.code==='KeyV'){heldKey=false;setVision(heldPointer!==null||latched);}});
  addEventListener('blur',()=>{releaseVision();endBullet();});
  addEventListener('site:rendergate',e=>{blocked=e.detail.blocked;if(blocked){releaseVision();endBullet();}scheduleDeja();});

  const phone=document.createElement('section');phone.className='exit-phone';phone.setAttribute('aria-label','Телефонный выход');
  phone.innerHTML='<div class="exit-copy"><span class="small-label">EXIT NODE / 001</span><h3>ЕСТЬ ВЫХОД.</h3><p>Нужен только один звонок.</p></div><div class="phone-console" data-state="idle"><div class="phone-screen"><span class="phone-signal">● SECURE LINE</span><span id="phone-display" role="status" aria-live="polite">ЛИНИЯ СВОБОДНА</span><span class="phone-digits" aria-hidden="true">··· ··· ···</span></div><button type="button" id="phone-connect" aria-expanded="false" aria-controls="phone-channels"><svg viewBox="0 0 80 40" aria-hidden="true"><path d="M9 30C4 28 5 14 12 10C27 1 53 1 68 10C75 14 76 28 71 30L57 27L55 18C46 15 34 15 25 18L23 27Z" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>УСТАНОВИТЬ СОЕДИНЕНИЕ</span><span aria-hidden="true">↗</span></button><div id="phone-channels" hidden><p>КАНАЛ ОТКРЫТ. ТВОЙ ХОД.</p><div><a href="https://github.com/narysh" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="https://sourcecraft.dev/users/naryshevserg/overview" target="_blank" rel="noopener noreferrer">SOURCECRAFT ↗</a></div><button type="button" id="phone-disconnect">ЗАВЕРШИТЬ СОЕДИНЕНИЕ</button></div></div>';
  $('.contact-links').before(phone);
  let phoneTimers=[];const consoleNode=$('.phone-console'),connect=$('#phone-connect'),channels=$('#phone-channels');
  function phoneText(value){$('#phone-display').textContent=text(value);}
  function clearPhoneTimers(){phoneTimers.forEach(clearTimeout);phoneTimers=[];}
  function resetPhone(){clearPhoneTimers();connect.querySelector('span').textContent=text('УСТАНОВИТЬ СОЕДИНЕНИЕ');consoleNode.dataset.state='idle';channels.hidden=true;connect.disabled=false;connect.setAttribute('aria-expanded','false');phoneText('ЛИНИЯ СВОБОДНА');$('.phone-digits').textContent='··· ··· ···';}
  function connected(){clearPhoneTimers();connect.querySelector('span').textContent=text('ВЫБРАТЬ КАНАЛ');consoleNode.dataset.state='connected';channels.hidden=false;connect.disabled=false;connect.setAttribute('aria-expanded','true');phoneText('СОЕДИНЕНИЕ УСТАНОВЛЕНО');$('.phone-digits').textContent='001 / CONNECTED';}
  connect.addEventListener('click',()=>{
    if(consoleNode.dataset.state==='connected'){channels.querySelector('a').focus();return;}
    if(consoleNode.dataset.state==='dialing')return;
    if(paused()||reduced.matches){connected();return;}
    consoleNode.dataset.state='dialing';connect.disabled=true;connect.querySelector('span').textContent=text('СОЕДИНЕНИЕ…');phoneText('НАБОР НОМЕРА…');$('.phone-digits').textContent='001 ··· ···';
    phoneTimers.push(setTimeout(()=>{phoneText('ПОИСК ВЫХОДА…');$('.phone-digits').textContent='001 101 011';},430),setTimeout(connected,1150));
  });
  $('#phone-disconnect').addEventListener('click',()=>{resetPhone();connect.focus();});

  const deja=document.createElement('button');deja.id='deja-vu';deja.type='button';deja.hidden=true;deja.setAttribute('aria-expanded','false');deja.innerHTML='<span class="deja-echo" aria-hidden="true">DÉJÀ VU</span><span>DÉJÀ VU</span><small>СБОЙ РЕАЛЬНОСТИ ↗</small>';document.body.append(deja);
  const dejaNote=document.createElement('div');dejaNote.id='deja-note';dejaNote.hidden=true;dejaNote.innerHTML='<span>ANOMALY / 01</span><p>A CHANGE<br>IN THE MATRIX.</p><small>Ты заметил повтор. Система тоже.</small><button type="button" id="deja-close">ВЕРНУТЬСЯ ↘</button>';document.body.append(dejaNote);deja.setAttribute('aria-controls','deja-note');
  const localEcho=document.createElement('div');localEcho.className='deja-line';localEcho.hidden=true;localEcho.setAttribute('aria-hidden','true');document.body.append(localEcho);
  let echoTimer=0;
  let dejaTimer=0,dejaHide=0,dejaSeen=false;try{dejaSeen=sessionStorage.getItem('narysh-deja')==='1';}catch{}
  function closeDeja(){localEcho.hidden=true;clearTimeout(echoTimer);dejaNote.hidden=true;deja.setAttribute('aria-expanded','false');deja.hidden=true;clearTimeout(dejaHide);}
  function triggerDeja(manual=false){
    if(document.hidden||blocked||vision)return;
    if(!manual&&(paused()||reduced.matches||dejaSeen))return;
    dejaSeen=true;try{sessionStorage.setItem('narysh-deja','1');}catch{}
    const source=[...document.querySelectorAll('.eyebrow,.section-kicker,.small-label')].find(node=>{const r=node.getBoundingClientRect();return r.top>90&&r.bottom<innerHeight-100&&r.width>0;});
    if(source&&!paused()&&!reduced.matches){const r=source.getBoundingClientRect();localEcho.textContent=source.textContent.trim().slice(0,64);localEcho.style.left=`${Math.max(15,r.left+6)}px`;localEcho.style.top=`${r.bottom+5}px`;localEcho.style.maxWidth=`${Math.min(r.width,innerWidth-30)}px`;localEcho.hidden=false;clearTimeout(echoTimer);echoTimer=setTimeout(()=>{localEcho.hidden=true;},1600);}
    deja.hidden=false;dejaNote.hidden=true;deja.setAttribute('aria-expanded','false');clearTimeout(dejaHide);dejaHide=setTimeout(closeDeja,18000);
  }
  function scheduleDeja(){clearTimeout(dejaTimer);if(!dejaSeen&&!document.hidden&&!paused()&&!blocked&&!vision&&!reduced.matches)dejaTimer=setTimeout(()=>triggerDeja(),32000+Math.random()*16000);}
  deja.addEventListener('click',()=>{clearTimeout(dejaHide);dejaNote.hidden=false;deja.setAttribute('aria-expanded','true');$('#deja-close').focus();});
  $('#deja-close').addEventListener('click',()=>{closeDeja();visionButton.focus();});
  addEventListener('site:dejavu',()=>triggerDeja(true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseVision();endBullet();clearTimeout(dejaTimer);if(consoleNode.dataset.state==='dialing')resetPhone();}else scheduleDeja();});
  new MutationObserver(()=>{if(paused()){endBullet();cancelAnimationFrame(raf);raf=0;if(consoleNode.dataset.state==='dialing')connected();}else{last=performance.now();scheduleRain();}scheduleDeja();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  addEventListener('site:language',()=>{window.siteTranslate(actions);window.siteTranslate(phone);window.siteTranslate(deja);window.siteTranslate(dejaNote);window.siteTranslate(visionButton);});
  scheduleDeja();
})();
