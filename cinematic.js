(() => {
  'use strict';
  const $=s=>document.querySelector(s), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const enabled=()=>!reduced.matches&&!document.body.classList.contains('motion-paused');
  const en=()=>document.documentElement.lang==='en';
  let mirrorBusy=false,themeBusy=false,source=null,closing=false;
  function metallic(host,rect,duration=640,reverse=false){
    const surface=document.createElement('div');surface.className='mercury-surface';surface.setAttribute('aria-hidden','true');
    surface.innerHTML='<span>REALITY / RECONSTRUCTING</span>';Object.assign(surface.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});host.append(surface);
    const anim=surface.animate([{opacity:0,transform:'scale(.94)',borderRadius:'45%'},{opacity:.96,transform:'scale(1.015)',borderRadius:'14%',offset:.35},{opacity:0,transform:'scale(1.08)',borderRadius:'2%'}],{duration,direction:reverse?'reverse':'normal',easing:'cubic-bezier(.2,.7,.2,1)'});anim.finished.catch(()=>{}).finally(()=>surface.remove());return anim;
  }
  window.Cinematic={
    openProject(button,data,content){
      if(mirrorBusy)return;const dialog=$('#project-dialog');source=button;closing=false;
      const isWeather=button.dataset.project==='weather';
      const visual=$(isWeather?'.project-weather .weather-visual':'.project-marline .index-visual')||$('.index-visual');
      const clone=visual?.cloneNode(true);clone?.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
      $('#project-file').textContent=data.file;
      $('#project-detail').innerHTML=`<div class="dossier"><div class="dossier-stage" aria-hidden="true"><div class="dossier-label a">${isWeather?'COMPOSE / INTERFACE':'RUST / INVERTED INDEX'}</div><div class="dossier-object"></div><div class="dossier-label b">${isWeather?'ROOM / OFFLINE CACHE':'HEURISTICS / JACCARD'}</div><span class="dossier-coordinates">${isWeather?'01 / MOBILE SYSTEM':'02 / SEARCH STRUCTURE'}</span></div><div class="dossier-copy">${content}</div></div>`;
      if(clone)$('#project-detail .dossier-object').append(clone);
      const rect=button.closest('.project').getBoundingClientRect();
      dialog.showModal();dialog.scrollTop=0;
      if(enabled()){
        mirrorBusy=true;metallic(dialog,{left:Math.max(16,rect.left),top:Math.max(16,rect.top),width:Math.min(rect.width,innerWidth-32),height:Math.min(rect.height,innerHeight-32)});
        dialog.animate([{opacity:.2,transform:'perspective(1200px) translateY(45px) rotateX(7deg) scale(.92)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'}).finished.catch(()=>{}).finally(()=>mirrorBusy=false);
        [...dialog.querySelectorAll('.dossier-label,.dossier-copy > *')].forEach((e,i)=>e.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:480,delay:Math.min(i*45+180,500),fill:'backwards',easing:'ease-out'}));
      }
    },
    theme(mode,button,apply){
      if(themeBusy)return;if(!enabled()){apply(mode);return;}
      themeBusy=true;const r=button.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
      const human=mode==='human',veil=document.createElement('div');veil.className='theme-veil';veil.setAttribute('aria-hidden','true');
      veil.style.cssText=`--veil-x:${x}px;--veil-y:${y}px;--veil-bg:${human?'#f1eee6':'#080c09'};--veil-ink:${human?'#b2482a':'#b5ff3c'};--veil-line:${human?'#b2482a70':'#b5ff3c70'}`;
      veil.innerHTML=`<span>${human?'HUMAN':'SYSTEM'}</span>`;document.body.append(veil);
      const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      const expansion=veil.animate([{clipPath:`circle(0px at ${x}px ${y}px)`},{clipPath:`circle(${radius}px at ${x}px ${y}px)`}],{duration:620,fill:'forwards',easing:'cubic-bezier(.65,0,.2,1)'});
      expansion.finished.then(()=>{apply(mode);return veil.animate([{opacity:1},{opacity:0}],{duration:240}).finished;}).catch(()=>apply(mode)).finally(()=>{veil.remove();themeBusy=false;});
    }
  };
  const dialog=$('#project-dialog');
  function closeDossier(){if(closing)return;closing=true;if(!enabled()){dialog.close();closing=false;return;}mirrorBusy=true;metallic(dialog,dialog.getBoundingClientRect(),340,true);dialog.animate([{opacity:1,transform:'none'},{opacity:0,transform:'perspective(1200px) scale(.93) rotateX(-4deg)'}],{duration:330,easing:'ease-in'}).finished.catch(()=>{}).finally(()=>{dialog.close();closing=false;mirrorBusy=false;source?.focus({preventScroll:true});});}
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target.closest('.close-dialog')||e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){e.stopImmediatePropagation();closeDossier();}},true);
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeDossier();});
  dialog.addEventListener('pointermove',e=>{if(!enabled()||e.pointerType==='touch')return;const stage=$('.dossier-stage'),r=stage?.getBoundingClientRect();if(!r)return;stage.style.setProperty('--dossier-x',((e.clientX-r.left)/r.width-.5)*12+'deg');stage.style.setProperty('--dossier-y',-((e.clientY-r.top)/r.height-.5)*9+'deg');});
  dialog.addEventListener('pointerleave',()=>{const s=$('.dossier-stage');s?.style.removeProperty('--dossier-x');s?.style.removeProperty('--dossier-y');});
  // Decode individual text nodes so emphasis, line breaks and translations survive.
  const glyphs='01アイウエオカキクケコ[]{}';
  const decodeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;decodeObserver.unobserve(entry.target);if(!enabled())return;const el=entry.target;el.classList.add('decoding');const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];let n;while(n=walker.nextNode())if(n.textContent.trim())nodes.push({n,text:n.textContent});const start=performance.now(),language=document.documentElement.lang;let last=0;
    function wave(now){if(!enabled()||document.hidden||language!==document.documentElement.lang){nodes.forEach(({n,text})=>{if(n.isConnected&&language===document.documentElement.lang)n.textContent=text;});el.classList.remove('decoding');return;}const p=Math.min(1,(now-start)/650);if(now-last>36){last=now;nodes.forEach(({n,text})=>{n.textContent=[...text].map((c,i)=>{const t=i/text.length;return /\s/.test(c)||t<p-.14||t>p+.1?c:glyphs[(i+Math.floor(now/40))%glyphs.length];}).join('');});}if(p<1)requestAnimationFrame(wave);else{nodes.forEach(({n,text})=>n.textContent=text);el.classList.remove('decoding');}}
    requestAnimationFrame(wave);
  }),{threshold:.45});
  document.querySelectorAll('.operator-title h2,.projects-heading h2,.project-content h3,.stack-line h3,.contact-title').forEach(e=>{e.classList.add('decode-target');decodeObserver.observe(e);});
  // One transient low-resolution field, running only while input is fading.
  const field=document.createElement('canvas');field.id='presence-field';field.setAttribute('aria-hidden','true');document.body.append(field);const ctx=field.getContext('2d');let raf=0,lastInput=0,lastPoint=null,trail=[],rings=[],lastFrame=0;
  const fine=matchMedia('(pointer:fine)');function resize(){field.width=Math.ceil(innerWidth/2);field.height=Math.ceil(innerHeight/2);}resize();addEventListener('resize',resize);
  function schedule(){if(!raf&&enabled()&&!document.hidden&&!document.querySelector('dialog[open]'))raf=requestAnimationFrame(draw);}
  function draw(now){raf=0;if(!enabled()||document.hidden||document.querySelector('dialog[open]')){ctx.clearRect(0,0,field.width,field.height);trail=[];rings=[];return;}if(now-lastFrame<32){schedule();return;}lastFrame=now;ctx.clearRect(0,0,field.width,field.height);ctx.save();ctx.scale(.5,.5);const human=document.body.classList.contains('human');ctx.strokeStyle=human?'#b2482a':'#b5ff3c';ctx.fillStyle=ctx.strokeStyle;
    trail=trail.filter(p=>now-p.t<650);rings=rings.filter(p=>now-p.t<850);for(let i=1;i<trail.length;i++){ctx.globalAlpha=(1-(now-trail[i].t)/650)*.4;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(trail[i-1].x,trail[i-1].y);ctx.lineTo(trail[i].x,trail[i].y);ctx.stroke();}
    if(lastPoint&&now-lastInput<650){const {x,y}=lastPoint;for(let ix=-2;ix<=2;ix++)for(let iy=-2;iy<=2;iy++){let gx=Math.round(x/42)*42+ix*42,gy=Math.round(y/42)*42+iy*42,dx=gx-x,dy=gy-y,d=Math.hypot(dx,dy),force=Math.max(0,1-d/130);gx+=dx*force*.16;gy+=dy*force*.16;ctx.globalAlpha=force*.4*(1-(now-lastInput)/650);ctx.beginPath();ctx.moveTo(gx-3,gy);ctx.lineTo(gx+3,gy);ctx.moveTo(gx,gy-3);ctx.lineTo(gx,gy+3);ctx.stroke();}}
    rings.forEach(p=>{const t=(now-p.t)/850;ctx.globalAlpha=(1-t)*.5;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.x,p.y,8+t*180,5+t*110,-.3,0,Math.PI*2);ctx.stroke();});ctx.restore();if(trail.length||rings.length||now-lastInput<650)schedule();
  }
  addEventListener('pointermove',e=>{if(!fine.matches||e.pointerType==='touch'||!enabled())return;lastInput=performance.now();lastPoint={x:e.clientX,y:e.clientY};trail.push({...lastPoint,t:lastInput});if(trail.length>24)trail.shift();schedule();},{passive:true});
  addEventListener('pointerdown',e=>{if(!enabled()||e.target.closest('dialog,input,textarea'))return;rings.push({x:e.clientX,y:e.clientY,t:performance.now()});if(rings.length>3)rings.shift();schedule();},{passive:true});
})();
