(() => {
  'use strict';
  const one = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const modeSwitch = document.createElement('div');
  modeSwitch.className = 'mode-switch';
  modeSwitch.setAttribute('role', 'group');
  modeSwitch.setAttribute('aria-label', 'Визуальный режим');
  modeSwitch.innerHTML = '<button type="button" data-mode="system" aria-pressed="true"><span class="mode-symbol">⌘</span> SYSTEM</button><button type="button" data-mode="human" aria-pressed="false"><span class="mode-symbol">◒</span> HUMAN</button>';
  one('.nav nav').after(modeSwitch);
  const journey = document.createElement('section');
  journey.id = 'journey';
  journey.className = 'journey';
  journey.setAttribute('aria-label', 'Путешествие сквозь код: от цифрового узла к проектам');
  journey.innerHTML = `
    <div class="journey-sticky">
      <canvas id="journey-canvas" aria-hidden="true"></canvas>
      <div class="journey-top"><span>[ ПЕРЕХОД В РЕАЛЬНОСТЬ ]</span><span id="journey-frame">FRAME / 0000</span></div>
      <div class="journey-intro"><p class="small-label">СКРОЛЛ — ТВОЯ КАМЕРА</p><h2><span id="journey-title">СКВОЗЬ</span><br><em id="journey-subtitle">КОД.</em></h2><p id="journey-caption">Всё начинается с идеи.<br>Продолжай прокрутку.</p></div>
      <div class="journey-weather" aria-hidden="true"><div class="journey-weather-head">WEATHER PROTOCOL <span>↗</span></div><p>САНКТ-ПЕТЕРБУРГ</p><div class="journey-temp">+12°<span>✳</span></div><div class="journey-forecast">СЕГОДНЯ · ПОЧАСОВОЙ ПРОГНОЗ</div><svg viewBox="0 0 270 70"><path d="M0 56Q30 40 60 46T125 20T190 30T270 8" fill="none" stroke="currentColor" stroke-width="2"/></svg><div class="journey-times"><span>12:00<br>+12°</span><span>15:00<br>+14°</span><span>18:00<br>+11°</span></div><div class="journey-cache">● OFFLINE CACHE READY</div></div>
      <div class="journey-index" aria-hidden="true"><span>QUERY → SKETCH → CANDIDATES</span><div>HEURISTIC<br><b>INDEX_</b></div><p>MAX_DF / JACCARD / RARE_FIRST</p></div>
      <div class="journey-side" aria-hidden="true">IDEA → INTERFACE → ALGORITHM</div>
      <div class="journey-bottom"><div class="journey-steps"><button type="button" data-journey-stage="0.06" class="active" aria-label="Этап 1: код">01 / КОД</button><button type="button" data-journey-stage="0.5" aria-label="Этап 2: интерфейс">02 / ИНТЕРФЕЙС</button><button type="button" data-journey-stage="0.92" aria-label="Этап 3: алгоритм">03 / АЛГОРИТМ</button></div><div class="journey-progress"><i></i></div><span class="journey-scroll">ПРОДОЛЖАЙ ↓</span></div>
      <a class="journey-skip" href="#projects">К ПРОЕКТАМ ↘</a>
    </div>`;
  one('#projects').before(journey);
  all('[data-journey-stage]').forEach(button=>button.addEventListener('click',()=>{const top=journey.getBoundingClientRect().top+scrollY;scrollTo({top:top+(journey.offsetHeight-innerHeight)*Number(button.dataset.journeyStage),behavior:document.body.classList.contains('motion-paused')?'instant':'smooth'});}));
  one('.primary-link').setAttribute('href', '#journey');

  const control = document.createElement('section');
  control.className = 'control-scene section-pad';
  control.id = 'control-scene';
  control.innerHTML = '<div class="section-kicker"><span>[ ЭКСПЕРИМЕНТ / СВОБОДА ВОЛИ ]</span><span>YOU ARE THE INPUT</span></div><div class="control-playground"><div class="control-orbit" aria-hidden="true"></div><span class="control-coordinate" aria-hidden="true">X_<span id="control-x">000</span> / Y_<span id="control-y">000</span></span><button class="control-word" type="button" aria-label="Ты управляешь интерфейсом. Нажми, чтобы рассыпать и собрать надпись."></button><span class="control-cross" aria-hidden="true">+</span></div><div class="control-bottom"><p id="control-status" role="status" aria-live="polite">ДВИГАЙ КУРСОРОМ. НАЖМИ, ЧТОБЫ ОТПУСТИТЬ.</p><span>ПОРЯДОК МОЖНО СОБРАТЬ ЗАНОВО.</span></div>';
  one('.terminal-section').before(control);
  const word = one('.control-word');
  function buildControlWords(){word.replaceChildren();
  (window.siteLanguage==='en'?['YOU CONTROL','THE INTERFACE.']:['ТЫ УПРАВЛЯЕШЬ', 'ИНТЕРФЕЙСОМ.']).forEach((line, lineIndex) => {
    const row = document.createElement('span');row.className = 'control-row';row.setAttribute('aria-hidden', 'true');
    [...line].forEach((char, i) => {const letter = document.createElement('span');letter.className = 'control-letter';letter.textContent = char === ' ' ? '\u00a0' : char;letter.dataset.n = String(i+lineIndex*19);row.append(letter);});word.append(row);
  });
  }
  buildControlWords();
  let letters = all('.control-letter');
  const state = {jDirty:true,vision:false,blocked:false,human: false,paused: document.body.classList.contains('motion-paused'),visible: !document.hidden,p:0,target:0,jActive:false,cActive:false,time:0,fly:0,raf:0,last:0,mx:0,my:0,tx:0,ty:0,hover:false};
  const jc = one('#journey-canvas'), gx = jc.getContext('2d');
  const journeyScene = new GlyphScene(jc);
  let w=1,h=1,scale=1;
  const glyphs='01アイウエオカキクケコサシスセソタチツテト{}<>/';
  const cloud=Array.from({length:1350},(_,i)=>{const t=(i%150)/150*Math.PI*2,a=Math.floor(i/150)/9*Math.PI*2,r=1.5+.53*Math.cos(3*t);return{x:(r+.2*Math.cos(a))*Math.cos(2*t),y:(r+.2*Math.cos(a))*Math.sin(2*t),z:.83*Math.sin(3*t)+.2*Math.sin(a),phase:t+a,g:(i*7)%glyphs.length};});
  journeyScene.setPoints(cloud);
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=t=>t*t*(3-2*t);
  function resize(){const r=jc.getBoundingClientRect();w=r.width;h=r.height;scale=1;jc.width=Math.round(w*scale);jc.height=Math.round(h*scale);gx.setTransform(scale,0,0,scale,0,0);state.jDirty=true;if(state.jActive)drawJourney();schedule();}
  const ro=new ResizeObserver(resize);ro.observe(jc);
  let phase=-1,lastLabel=-1,lastProgress=-1;
  const ui={title:one('#journey-title'),subtitle:one('#journey-subtitle'),caption:one('#journey-caption'),steps:all('.journey-steps button'),frame:one('#journey-frame'),progress:one('.journey-progress i'),weather:one('.journey-weather'),index:one('.journey-index')};
  function updateCopy(p){
    const next=p<.35?0:p<.7?1:2;
    if(next!==phase){phase=next;const copy=[['СКВОЗЬ','КОД.','Всё начинается с идеи.<br>Продолжай прокрутку.'],['В ФОРМУ','ОПЫТА.','Символы становятся интерфейсом.<br>Kotlin / Compose / Weather App'],['ДО СУТИ','ДАННЫХ.','Интерфейс уходит. Остаётся алгоритм.<br>Rust / SBC / эвристический поиск']][next];ui.title.textContent=window.siteText(copy[0]);ui.subtitle.textContent=window.siteText(copy[1]);ui.caption.innerHTML=window.siteText(copy[2]);ui.steps.forEach((e,i)=>{e.classList.toggle('active',i===next);e.setAttribute('aria-current',i===next?'step':'false');});}
    const label=Math.round(p*2400);
    if(label!==lastLabel){ui.frame.textContent=`FRAME / ${String(label).padStart(4,'0')}`;lastLabel=label;}
    if(Math.abs(p-lastProgress)<.0001)return;
    lastProgress=p;ui.progress.style.transform=`scaleX(${p})`;
    ui.weather.style.opacity=String(clamp((p-.35)/.1)*clamp((.72-p)/.12));
    ui.weather.style.transform=`translate(-50%,-50%) perspective(900px) rotateY(${mix(-17,7,clamp((p-.35)/.35))}deg) rotateZ(${mix(-5,2,clamp((p-.35)/.35))}deg) scale(${mix(.86,1.02,clamp((p-.35)/.35))})`;
    ui.index.style.opacity=String(clamp((p-.76)/.14));
    journey.style.setProperty('--journey-progress',String(p));
  }
  function drawJourney(){
    if(!w||!h)return;const frameStart=RenderKit.profile?performance.now():0;const p=state.p;const human=state.human;
    gx.clearRect(0,0,w,h);gx.textAlign='center';gx.textBaseline='middle';
    const base=w<700?Math.min(w*.28,h*.17):Math.min(w*.16,h*.21);
    const cx=w<700?w*.5:w*.64,cy=w<700?h*.54:h*.48;
    const into=ease(clamp(p/.35));
    const zoom=1+Math.pow(into,3)*5;
    const rotation=.4+p*2.5+state.time*.16;
    gx.strokeStyle=human?'#a04b2b20':'#b5ff3c15';gx.lineWidth=1;
    for(let x=0;x<w;x+=60){gx.beginPath();gx.moveTo(x,0);gx.lineTo(x,h);gx.stroke();}
    for(let y=0;y<h;y+=60){gx.beginPath();gx.moveTo(0,y);gx.lineTo(w,y);gx.stroke();}
    journeyScene.render({w,h,cx,cy,base,rotation,tilt:.4,p,journey:true,time:state.time,human});
    if(p<.34){gx.strokeStyle=human?'#b2482a50':'#b5ff3c50';gx.beginPath();gx.arc(cx,cy,Math.min(base*2.2*zoom,w*1.4),0,Math.PI*2);gx.stroke();}
    if(p>.79){gx.strokeStyle=human?'#b2482a90':'#b5ff3c90';gx.lineWidth=1;const iw=w<700?w*.73:w*.43,yy=cy+h*.18;for(let k=0;k<4;k++){const xx=cx-iw*.35+k*iw*.235;gx.beginPath();gx.moveTo(xx,cy-h*.13);gx.lineTo(xx,yy+25);gx.lineTo(cx+(k-1.5)*37,yy+48);gx.stroke();gx.strokeRect(cx+(k-1.5)*37-13,yy+48,26,26);} }
    updateCopy(p);state.jDirty=false;
    if(RenderKit.profile)RenderKit.record('journey',performance.now()-frameStart);
  }
  let scrollQueued=false;
  function measureScroll(){
    if(scrollQueued)return;scrollQueued=true;
    requestAnimationFrame(()=>{scrollQueued=false;const r=journey.getBoundingClientRect(),distance=journey.offsetHeight-innerHeight;const target=distance>0?clamp(-r.top/distance):0;if(Math.abs(target-state.target)>.0001){state.target=target;state.jDirty=true;}if(state.paused||reduce.matches){state.p=state.target;if(state.jActive)drawJourney();}else schedule();});
  }
  addEventListener('scroll',measureScroll,{passive:true});addEventListener('resize',measureScroll,{passive:true});
  new IntersectionObserver(entries=>{state.jActive=entries[0].isIntersecting;if(state.jActive){state.jDirty=true;if(state.paused){state.p=state.target;drawJourney();}}schedule();},{threshold:0}).observe(one('.journey-sticky'));
  const ci=new IntersectionObserver(e=>{state.cActive=e[0].isIntersecting;schedule();},{threshold:0});ci.observe(control);
  const playground=one('.control-playground');
  playground.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=playground.getBoundingClientRect();state.tx=((e.clientX-r.left)/r.width-.5)*2;state.ty=((e.clientY-r.top)/r.height-.5)*2;state.hover=true;one('#control-x').textContent=String(Math.round(e.clientX-r.left)).padStart(3,'0');one('#control-y').textContent=String(Math.round(e.clientY-r.top)).padStart(3,'0');schedule();});
  playground.addEventListener('pointerleave',()=>{state.tx=0;state.ty=0;state.hover=false;schedule();});
  let statusTimer;
  word.addEventListener('click',()=>{if(state.paused||reduce.matches){one('#control-status').textContent=window.siteText('КОНТРОЛЬ У ТЕБЯ. ДВИЖЕНИЕ ОСТАНОВЛЕНО.');return;}state.fly=1;state.releaseAt=performance.now();control.classList.add('control-released');one('#control-status').textContent=window.siteText('ОТПУСКАЕМ КОНТРОЛЬ. СОБИРАЕМ СМЫСЛ ЗАНОВО.');clearTimeout(statusTimer);statusTimer=setTimeout(()=>{state.fly=0;state.releaseAt=0;drawControl(0);control.classList.remove('control-released');one('#control-status').textContent=matchMedia('(pointer:coarse)').matches?window.siteText('КОСНИСЬ НАДПИСИ, ЧТОБЫ ПОВТОРИТЬ.'):window.siteText('ПОРЯДОК ВОССТАНОВЛЕН. МОЖНО ПОВТОРИТЬ.');},1800);schedule();});
  function drawControl(dt){state.mx+=(state.tx-state.mx)*.06;state.my+=(state.ty-state.my)*.06;state.fly=state.releaseAt?Math.max(0,1-(performance.now()-state.releaseAt)/1500):0;if(!state.fly)state.releaseAt=0;const fly=state.fly>0?Math.sin(state.fly*Math.PI):0;letters.forEach((letter,i)=>{const n=Number(letter.dataset.n),a=n*2.39996;const distance=fly*(110+n%7*32);const x=Math.cos(a)*distance+state.mx*(8+n%4*4);const y=Math.sin(a)*distance+state.my*(8+n%5*4);const rotate=Math.sin(a)*fly*90+state.mx*(n%2?1:-1)*1.2;letter.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rotate.toFixed(2)}deg)`;letter.style.opacity=String(1-fly*.52);});one('.control-cross').style.transform=`translate(${state.mx*100}px,${state.my*70}px)`;}
  function needsControl(){return !!state.releaseAt||Math.abs(state.mx-state.tx)>.001||Math.abs(state.my-state.ty)>.001;}
  function hasWork(){return state.jActive||(state.cActive&&needsControl());}
  function frame(now){
    state.raf=0;if(state.paused||!state.visible||state.blocked||state.vision)return;
    const elapsed=now-state.last;if(elapsed<(journeyScene.gl?1000/60:RenderKit.interval)-1){schedule();return;}
    const dt=Math.min(elapsed/1000,.1);state.last=now;state.time+=dt;
    if(state.jActive){state.p+=(state.target-state.p)*.25;if(Math.abs(state.target-state.p)<.001)state.p=state.target;drawJourney();}
    if(state.cActive&&needsControl())drawControl(dt);
    if(!hasWork())RenderKit.flush();
    schedule();
  }
  function schedule(){if(!state.raf&&!state.paused&&state.visible&&!state.blocked&&!state.vision&&hasWork())state.raf=requestAnimationFrame(frame);}
  window.addEventListener('site:vision',e=>{state.vision=e.detail.active;if(state.vision){cancelAnimationFrame(state.raf);state.raf=0;}else schedule();});
  window.addEventListener('site:rendergate',e=>{state.blocked=e.detail.blocked;if(state.blocked){cancelAnimationFrame(state.raf);state.raf=0;}else schedule();});
  const themeButtons=all('[data-mode]');
  function applyMode(mode){state.human=mode==='human';document.body.classList.toggle('human',state.human);document.documentElement.style.colorScheme=state.human?'light':'dark';themeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));one('meta[name="theme-color"]').setAttribute('content',state.human?'#f1eee6':'#080c09');try{localStorage.setItem('narysh-mode',mode);}catch{}drawJourney();}
  function changeMode(mode,button){
    if(state.human===(mode==='human'))return;
    // Avoid full-document View Transition snapshots on this long canvas page.
    applyMode(mode);
    if(!state.paused&&!reduce.matches)button.animate([{opacity:.45},{opacity:1}],{duration:160});
  }
  themeButtons.forEach(b=>b.addEventListener('click',()=>changeMode(b.dataset.mode,b)));
  let savedMode='system';try{savedMode=localStorage.getItem('narysh-mode')||'system';}catch{}applyMode(savedMode==='human'?'human':'system');
  new MutationObserver(()=>{const next=document.body.classList.contains('motion-paused');if(next===state.paused)return;state.paused=next;if(next){cancelAnimationFrame(state.raf);state.raf=0;state.fly=0;state.releaseAt=0;state.mx=state.my=state.tx=state.ty=0;letters.forEach(l=>{l.style.transform='none';l.style.opacity='1';});state.p=state.target;drawJourney();}else schedule();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{state.visible=!document.hidden;if(!state.visible){cancelAnimationFrame(state.raf);state.raf=0;}else schedule();});
  if(matchMedia('(pointer:coarse)').matches)one('#control-status').textContent=window.siteText('КОСНИСЬ НАДПИСИ, ЧТОБЫ ОТПУСТИТЬ КОНТРОЛЬ.');
  window.addEventListener('site:language',()=>{clearTimeout(statusTimer);state.fly=0;state.releaseAt=0;control.classList.remove('control-released');buildControlWords();letters=all('.control-letter');phase=-1;drawJourney();one('#control-status').textContent=window.siteText(state.paused?'КОНТРОЛЬ У ТЕБЯ. ДВИЖЕНИЕ ОСТАНОВЛЕНО.':matchMedia('(pointer:coarse)').matches?'КОСНИСЬ НАДПИСИ, ЧТОБЫ ОТПУСТИТЬ КОНТРОЛЬ.':'ДВИГАЙ КУРСОРОМ. НАЖМИ, ЧТОБЫ ОТПУСТИТЬ.');});
  measureScroll();
})();
