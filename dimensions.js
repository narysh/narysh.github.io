(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
  const motion=()=>!reduced.matches&&!document.body.classList.contains('motion-paused');
  const en=()=>document.documentElement.lang==='en';
  const text=(ru,eng)=>en()?eng:ru;
  const copy=(ru,eng)=>`<span data-d11-ru="${ru}" data-d11-en="${eng}">${text(ru,eng)}</span>`;
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,p)=>a+(b-a)*p,smooth=p=>p*p*(3-2*p);
  const room=document.createElement('section');room.className='construct-room';room.id='white-room';
  room.innerHTML=`<div class="room-sticky"><div class="room-horizon" aria-hidden="true"></div><div class="room-floor" aria-hidden="true"></div><div class="room-top"><span>CONSTRUCT / ORIGIN</span><span>SPACE_000 / ∞</span></div><h2 class="room-name">${copy('ВСЁ НАЧИНАЕТСЯ','EVERYTHING STARTS')}<br><em>${copy('С ПУСТОТЫ.','FROM NOTHING.')}</em></h2><div class="room-code" aria-hidden="true">${Array.from({length:10},(_,i)=>`<span style="left:${i*11}%">01 アイウエオ 1001 {} システム</span>`).join('')}</div><div class="room-shadow" aria-hidden="true"></div><div class="room-dock" aria-hidden="true"></div><p class="room-caption"><span>01 / THE CONSTRUCT</span>${copy('Пустое пространство. Одна идея. Дальше — всё, что можно из неё собрать.','An empty space. One idea. Everything else is what you build from it.')}</p><span class="room-scroll">${copy('ПРОДОЛЖАЙ ДВИЖЕНИЕ ↓','KEEP MOVING ↓')}</span></div>`;
  $('#journey').before(room);$('.primary-link').href='#white-room';
  const archive=document.createElement('section');archive.className='archive-space';archive.id='infinite-archive';
  const files=[{name:'WEATHER<br>PROTOCOL',symbol:'01',stack:'ANDROID / KOTLIN',key:'weather'},{name:'SEARCH.<br>BEYOND.',symbol:'02',stack:'RUST / HEURISTICS',key:'marline'},{name:'SBC<br>RESEARCH',symbol:'03',stack:'ALGORITHMS / IN PROGRESS',url:'https://github.com/narysh/report-3-sem'}];
  archive.innerHTML=`<div class="archive-top"><span>02 / INFINITE ARCHIVE</span><span>3 RECORDS / ENDLESS ORBIT</span></div><h2 class="archive-title">${copy('У КАЖДОЙ ИДЕИ','EVERY IDEA')}<em>${copy('ЕСТЬ ФОРМА.','HAS A FORM.')}</em></h2><div class="archive-travel-dock" aria-hidden="true"></div><div class="archive-stage" role="group" aria-label="${text('Пространственный архив проектов','Spatial project archive')}">${files.map((f,i)=>`<button class="archive-monolith" type="button" data-file="${i}" aria-current="${i===0}" style="--slot:${i===2?-1:i};--front:${i===0?1:0}"><span class="monolith-id">FILE_00${i+1} / SELECT</span><span class="monolith-symbol" aria-hidden="true">${f.symbol}</span><span class="monolith-name">${f.name}</span><span class="monolith-stack">${f.stack}</span></button>`).join('')}</div><div class="archive-toolbar"><button type="button" class="archive-prev" aria-label="${text('Предыдущий проект','Previous project')}">←</button><span class="archive-counter" aria-live="polite">01 / 03</span><button type="button" class="archive-next" aria-label="${text('Следующий проект','Next project')}">→</button></div><button type="button" class="archive-open">${copy('РАСКРЫТЬ ПРОЕКТ ↗','OPEN PROJECT ↗')}</button><p class="archive-caption">${copy('ВЫБЕРИ МОНОЛИТ · ИССЛЕДУЙ, ЧТО ВНУТРИ','SELECT A MONOLITH · EXPLORE WHAT IS INSIDE')}</p>`;
  $('#projects').before(archive);
  let selected=0,archiveTimer=0;
  function selectFile(index){selected=(index+files.length)%files.length;$$('.archive-monolith').forEach((b,i)=>{const slot=(i-selected+4)%3-1;b.style.setProperty('--slot',slot);b.style.setProperty('--front',i===selected?1:0);b.setAttribute('aria-current',String(i===selected));});$('.archive-counter').textContent=`0${selected+1} / 03`;schedule();}
  $('.archive-prev').addEventListener('click',()=>selectFile(selected-1));$('.archive-next').addEventListener('click',()=>selectFile(selected+1));
  $$('.archive-monolith').forEach(b=>b.addEventListener('click',()=>{if(swiped){swiped=false;return;}const i=Number(b.dataset.file);if(i===selected)openFile();else selectFile(i);}));
  function openFile(){const f=files[selected];if(f.key)$(`.project-expand[data-project="${f.key}"]`).click();else window.open(f.url,'_blank','noopener,noreferrer');}
  $('.archive-open').addEventListener('click',openFile);
  $('.archive-stage').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();selectFile(selected+(e.key==='ArrowRight'?1:-1));$('.archive-monolith[aria-current="true"]').focus({preventScroll:true});}});
  let swipeX=null,swiped=false;$('.archive-stage').addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){swipeX=e.clientX;swiped=false;}},{passive:true});$('.archive-stage').addEventListener('pointerup',e=>{if(swipeX!==null&&Math.abs(e.clientX-swipeX)>45){swiped=true;selectFile(selected+(e.clientX<swipeX?1:-1));}swipeX=null;},{passive:true});
  // A single travelling object follows cached document anchors, not per-frame layout reads.
  const traveller=document.createElement('div');traveller.id='traveller';traveller.setAttribute('aria-hidden','true');traveller.innerHTML='<canvas id="traveller-canvas"></canvas><div class="traveller-reticle"></div><span class="traveller-id">OBJ_001 / CONTINUITY</span>';document.body.append(traveller);
  const tc=$('#traveller-canvas');tc.width=tc.height=300;const travelScene=new GlyphScene(tc);
  const points=Array.from({length:600},(_,i)=>{const t=(i%100)/100*Math.PI*2,a=Math.floor(i/100)/6*Math.PI*2,r=1.5+.53*Math.cos(3*t);return{x:(r+.2*Math.cos(a))*Math.cos(2*t),y:(r+.2*Math.cos(a))*Math.sin(2*t),z:.83*Math.sin(3*t)+.2*Math.sin(a),g:i%RenderKit.glyphs.length};});travelScene.setPoints(points);
  const closing=document.createElement('section');closing.id='end-credits';closing.className='closing-scene';
  closing.innerHTML=`<div class="closing-sticky"><div class="closing-panels" aria-hidden="true"><span>WEATHER<br>PROTOCOL</span><span>SEARCH.<br>BEYOND.</span><span>N / CONSTRUCT</span></div><div class="closing-dock" aria-hidden="true"></div><div class="closing-copy"><p class="small-label">${copy('ПРОДОЛЖЕНИЕ СЛЕДУЕТ','TO BE CONTINUED')}</p><h2>${copy('СЕРГЕЙ','SERGEY')}<br><span>${copy('НАРЫШЕВ','NARYSHEV')}</span></h2><p>ANDROID / RUST / ALGORITHMS</p><div class="closing-links"><a href="https://github.com/narysh" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="https://sourcecraft.dev/users/naryshevserg/overview" target="_blank" rel="noopener noreferrer">SOURCECRAFT ↗</a><a href="#contact">${copy('КОНТАКТЫ ↗','CONTACT ↗')}</a></div><button class="replay-film" type="button">${copy('ЕЩЁ РАЗ ↺','PLAY AGAIN ↺')}</button></div><span class="closing-timecode">NARYSH / DIGITAL CONSTRUCT / END OF TRANSMISSION</span></div>`;
  $('#contact').after(closing);
  let replaying=false,replayRaf=0;
  $('.replay-film').addEventListener('click',()=>{cancelAnimationFrame(replayRaf);const from=scrollY,start=performance.now();if(!motion()){scrollTo(0,0);history.replaceState(null,'',location.pathname+location.search+'#home');return;}replaying=true;function replay(now){const p=clamp((now-start)/2200);scrollTo({top:from*(1-smooth(p)),behavior:'instant'});if(p<1)replayRaf=requestAnimationFrame(replay);else{replaying=false;history.replaceState(null,'',location.pathname+location.search+'#home');$('.wordmark').focus({preventScroll:true});}}replayRaf=requestAnimationFrame(replay);});
  function stopReplay(){if(replaying){replaying=false;cancelAnimationFrame(replayRaf);}}addEventListener('wheel',stopReplay,{passive:true});addEventListener('touchstart',stopReplay,{passive:true});addEventListener('keydown',stopReplay);
  // A scene owns the shared surface only while its own chapter is visible.
  let roomTop=0, roomHeight=1, endTop=0, endHeight=1, archiveTop=0, archiveHeight=1;
  let raf=0, last=0, time=0, dirty=true, inRoom=false, inEnd=false, inArchive=false;
  let depthTarget=null, depthX=0, depthY=0, layout=[];
  const blockers=new Set();
  const blocked=()=>blockers.size>0;
  function measure(){
    const bounds=e=>{const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+scrollY+r.height/2,top:r.top+scrollY,height:r.height};};
    const r=bounds(room),a=bounds(archive),e=bounds(closing);
    roomTop=r.top;roomHeight=r.height;archiveTop=a.top;archiveHeight=a.height;endTop=e.top;endHeight=e.height;
    layout=[bounds($('.room-dock')),bounds($('.archive-travel-dock')),bounds($('.closing-dock'))];
    dirty=true;schedule();
  }
  function currentScene(){
    const camera=scrollY+innerHeight*.5;
    if(camera>=roomTop&&camera<roomTop+roomHeight)return {anchor:layout[0],form:0,size:innerWidth<700?.72:.95,ink:[.08,.12,.07]};
    if(innerWidth>=900&&camera>=archiveTop&&camera<archiveTop+archiveHeight)return {anchor:layout[1],form:selected===0?1:2,size:.5};
    if(camera>=endTop&&camera<endTop+endHeight)return {anchor:layout[2],form:3,size:.5};
    return null;
  }
  function frame(now){
    raf=0;
    if(document.hidden||blocked())return;
    if(now-last<33&&!dirty){schedule();return;}
    const start=RenderKit.profile?performance.now():0;
    const dt=Math.min(Math.max(0,(now-last)/1000),.05);last=now;
    if(motion())time+=dt;
    const y=scrollY,vh=innerHeight;
    const rp=clamp((y-roomTop)/Math.max(1,roomHeight-vh));
    const ep=clamp((y-endTop)/Math.max(1,endHeight-vh));
    room.style.setProperty('--room-p',rp.toFixed(4));closing.style.setProperty('--end-p',ep.toFixed(4));
    const scene=currentScene();
    // Sticky chapters keep their focal point in the viewport as the floor moves.
    if(scene){
      const isRoom=scene.form===0;
      const x=scene.anchor.x;
      const localY=isRoom?vh*.6:scene.form===3?vh*.19:scene.anchor.y-y;
      traveller.style.opacity='1';
      traveller.style.transform=`translate3d(${(x-150).toFixed(1)}px,${(localY-150).toFixed(1)}px,0) scale(${scene.size})`;
      travelScene.render({w:300,h:300,cx:150,cy:150,base:51,rotation:time*.23,tilt:.2,form:scene.form,time,human:document.body.classList.contains('human'),ink:scene.ink});
    }else traveller.style.opacity='0';
    if(depthTarget){depthTarget.style.setProperty('--depth-x',depthX);depthTarget.style.setProperty('--depth-y',depthY);depthTarget=null;}
    dirty=false;
    if(RenderKit.profile)RenderKit.record('continuity',performance.now()-start);
    if(scene&&motion())schedule();
  }
  function schedule(){if(!raf&&!document.hidden&&!blocked())raf=requestAnimationFrame(frame);}
  function gate(name,active){
    if(active)blockers.add(name);else blockers.delete(name);
    if(blocked()){cancelAnimationFrame(raf);raf=0;traveller.style.opacity='0';}
    else{last=performance.now();dirty=true;schedule();}
  }
  addEventListener('scroll',()=>{dirty=true;schedule();},{passive:true});
  addEventListener('resize',measure,{passive:true});
  new ResizeObserver(measure).observe(document.querySelector('main'));
  const sceneObserver=new IntersectionObserver(entries=>{
    for(const e of entries){if(e.target===room)inRoom=e.isIntersecting;if(e.target===closing)inEnd=e.isIntersecting;if(e.target===archive)inArchive=e.isIntersecting;}
    dirty=true;schedule();
  });
  [room,archive,closing].forEach(e=>sceneObserver.observe(e));
  addEventListener('site:rendergate',e=>gate('dialog',e.detail.blocked));
  addEventListener('site:vision',e=>gate('vision',e.detail.active));
  new MutationObserver(()=>{
    if(!motion()){stopArchiveOrbit();stopScan();}
    else if(document.body.classList.contains('director-mode')&&!archiveTimer)startArchiveOrbit();
    last=performance.now();dirty=true;schedule();
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(raf);raf=0;stopArchiveOrbit();stopScan();}
    else{last=performance.now();dirty=true;schedule();if(document.body.classList.contains('director-mode'))startArchiveOrbit();}
  });
  $$('.operator-title h2,.projects-heading h2,.archive-title,.closing-copy h2').forEach(el=>{el.classList.add('depth-title');const echo=document.createElement('span');echo.className='depth-echo';echo.setAttribute('aria-hidden','true');echo.setAttribute('data-no-translate','');echo.textContent=el.innerText;el.append(echo);el.addEventListener('pointermove',e=>{if(!fine.matches||!motion())return;const r=el.getBoundingClientRect();depthX=((e.clientX-r.left)/r.width-.5).toFixed(2);depthY=((e.clientY-r.top)/r.height-.5).toFixed(2);depthTarget=el;dirty=true;schedule();});el.addEventListener('pointerleave',()=>{el.style.setProperty('--depth-x',0);el.style.setProperty('--depth-y',0);});});
  // Project gravity follows the same modal lifecycle, including Escape and backdrop closing.
  const pd=$('#project-dialog');let scanTimer=0,scanStepTimer=0;
  document.addEventListener('click',e=>{const b=e.target.closest('.project-expand[data-project]');if(!b)return;const card=b.closest('.project');$('.projects').classList.add('gravity-active');card?.classList.add('gravity-source');},true);
  function stopScan(){clearTimeout(scanTimer);clearInterval(scanStepTimer);$('.dossier-stage')?.classList.remove('is-scanning');const b=$('.scan-trigger');if(b){b.disabled=false;b.setAttribute('aria-pressed','false');}}
  function attachScanner(){if(!pd.open)return;const stage=$('.dossier-stage'),body=$('.dossier-copy');if(!stage||!body||$('.scan-console'))return;const weather=$('#project-file').textContent.includes('WEATHER');
    const paths=['<rect x="30" y="8" width="90" height="100" rx="8"/><path d="M40 28h70M40 40h40M40 55h70M40 70h70M40 85h40"/>','<path d="M20 30h35v35H20zM95 30h35v35H95zM55 48h40M75 48v42M55 90h40"/>','<ellipse cx="75" cy="20" rx="45" ry="12"/><path d="M30 20v65c0 20 90 20 90 0V20M30 50c0 20 90 20 90 0"/>','<path d="M15 65a85 85 0 0 1 120 0M35 80a56 56 0 0 1 80 0M55 95a28 28 0 0 1 40 0"/><circle cx="75" cy="110" r="4"/>'];
    const layers=weather?['COMPOSE / UI','HILT / DEPENDENCIES','ROOM / CACHE','KTOR / NETWORK']:['SKETCH / INPUT','INVERTED INDEX','JACCARD / FILTER','CANDIDATES / OUTPUT'];
    stage.insertAdjacentHTML('beforeend',`<div class="scanner-stack" aria-hidden="true">${layers.map((l,i)=>`<div class="scan-layer" style="--layer:${i}"><svg viewBox="0 0 150 125">${paths[i]}</svg><span>${l}</span></div>`).join('')}<div class="scan-beam"></div><div class="scan-legend"><span>STRUCTURAL SCAN</span><span>04 LAYERS</span></div></div>`);
    body.insertAdjacentHTML('afterend',`<div class="scan-console"><button type="button" class="scan-trigger" aria-pressed="false">${copy('СКАНИРОВАТЬ АРХИТЕКТУРУ','SCAN ARCHITECTURE')}<span>⌖</span></button><p class="scan-readout" aria-live="polite">${copy('Посмотри, как связаны внутренние слои проекта.','Explore how the internal layers connect.')}</p></div>`);
    // Keep the controls with the text column on wide screens.
    body.append($('.scan-console'));
    $('.scan-trigger').addEventListener('click',e=>{stopScan();const b=e.currentTarget;b.disabled=true;b.setAttribute('aria-pressed','true');stage.classList.remove('is-scanning');void stage.offsetWidth;stage.classList.add('is-scanning');let i=0;const readout=$('.scan-readout');readout.textContent=layers[i];if(motion()){scanStepTimer=setInterval(()=>{i=Math.min(3,i+1);readout.textContent=layers[i];},1050);scanTimer=setTimeout(()=>{stopScan();readout.textContent=text('Сканирование завершено. Все четыре слоя на месте.','Scan complete. All four layers connected.');},4900);}else{readout.textContent=layers.join(' → ');b.disabled=false;b.setAttribute('aria-pressed','false');}});
  }
  new MutationObserver(()=>{if(pd.open){attachScanner();}else{stopScan();$('.projects').classList.remove('gravity-active');$$('.gravity-source').forEach(e=>e.classList.remove('gravity-source'));}}).observe(pd,{attributes:true,attributeFilter:['open']});
  // Peel a real interactive corner. Keyboard activation opens the same layer.
  const peel=document.createElement('button');peel.type='button';peel.className='reality-handle';peel.setAttribute('aria-expanded','false');peel.setAttribute('aria-controls','reality-underlay');peel.setAttribute('aria-label',text('Потянуть угол реальности','Peel the corner of reality'));peel.innerHTML='<span aria-hidden="true">↗</span>';
  const under=document.createElement('div');under.id='reality-underlay';under.className='reality-layer';under.inert=true;under.setAttribute('role','dialog');under.setAttribute('aria-modal','true');under.setAttribute('aria-label',text('Под поверхностью','Beneath the surface'));
  under.innerHTML=`<div class="reality-wire" aria-hidden="true"></div><svg viewBox="0 0 1000 650" aria-hidden="true"><path d="M100 520L300 130 680 60 900 390 650 600 100 520 680 60 650 600 300 130 900 390 100 520M300 130L650 600M680 60L900 390"/><circle cx="490" cy="330" r="220"/><ellipse cx="490" cy="330" rx="360" ry="100"/></svg><div class="reality-content"><span class="reality-kicker">LAYER_002 / WIREFRAME</span><h2>${copy('ТЫ ПОСМОТРЕЛ','YOU LOOKED')}<br><span>${copy('ГЛУБЖЕ.','DEEPER.')}</span></h2><p>${copy('У каждого интерфейса есть внутренняя сторона. Здесь остаются координаты, связи и правила, из которых собирается видимое.','Every interface has an inner side. Coordinates, connections and rules assemble everything you see.')}</p><span class="reality-coordinate">X_000 · Y_000 · Z_001 / SOURCE OF REALITY</span></div><button type="button" class="reality-close">${copy('СОБРАТЬ ОБРАТНО ×','REASSEMBLE ×')}</button>`;
  document.body.append(under,peel);let tearOpen=false,tearDrag=null,tearDragged=false,tearReturn=null;
  function setTear(open){tearOpen=open;under.classList.toggle('open',open);under.classList.remove('dragging');under.inert=!open;under.style.setProperty('--tear-radius',open?Math.hypot(innerWidth,innerHeight)+'px':'0px');peel.setAttribute('aria-expanded',String(open));document.body.classList.toggle('reality-open',open);$$('main,.nav,.system-controls').forEach(e=>e.inert=open);if(open){tearReturn=document.activeElement;$('.reality-close').focus({preventScroll:true});}else{(tearReturn||peel).focus({preventScroll:true});}window.dispatchEvent(new CustomEvent('site:dimensiongate',{detail:{active:open}}));window.dispatchEvent(new CustomEvent('site:rendergate',{detail:{blocked:open}}));}
  peel.addEventListener('pointerdown',e=>{if(e.button!==0||document.querySelector('dialog[open]'))return;tearDrag={id:e.pointerId,x:e.clientX,y:e.clientY};tearDragged=false;peel.setPointerCapture(e.pointerId);});
  peel.addEventListener('pointermove',e=>{if(!tearDrag||tearDrag.id!==e.pointerId)return;const d=Math.hypot(e.clientX-tearDrag.x,e.clientY-tearDrag.y);if(d>8){tearDragged=true;under.classList.add('dragging');under.style.setProperty('--tear-radius',Math.min(Math.hypot(innerWidth,innerHeight),d*2.8)+'px');}});
  function releaseTear(e){if(!tearDrag||e.pointerId!==tearDrag.id)return;const distance=Math.hypot(e.clientX-tearDrag.x,e.clientY-tearDrag.y);tearDrag=null;if(tearDragged)setTear(distance>75);}
  peel.addEventListener('pointerup',releaseTear);peel.addEventListener('pointercancel',()=>{tearDrag=null;setTear(false);});peel.addEventListener('click',()=>{if(!document.querySelector('dialog[open]')&&!tearDragged)setTear(!tearOpen);tearDragged=false;});$('.reality-close').addEventListener('click',()=>setTear(false));
  under.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();setTear(false);}if(e.key==='Tab'){e.preventDefault();$('.reality-close').focus();}});
  addEventListener('resize',()=>{if(tearOpen)under.style.setProperty('--tear-radius',Math.hypot(innerWidth,innerHeight)+'px');});
  // Director mode is reachable from both the terminal and an accessible command item.
  const director=document.createElement('div');director.className='director-controls';director.innerHTML=`<span>● DIRECTOR / VISUAL ONLY</span><button type="button" class="director-exit">${copy('ВЫЙТИ · ESC','EXIT · ESC')}</button>`;document.body.append(director);
  const directorCommand=document.createElement('button');directorCommand.dataset.director='true';directorCommand.type='button';directorCommand.innerHTML=`<kbd>6</kbd>${copy('Режиссёрский режим','Director mode')}<span>◉</span>`;$('.command-options').append(directorCommand);
  function stopArchiveOrbit(){clearInterval(archiveTimer);archiveTimer=0;}
  function startArchiveOrbit(){stopArchiveOrbit();if(motion()&&!document.hidden)archiveTimer=setInterval(()=>{if(inArchive&&!pd.open)selectFile(selected+1);},3200);}
  function setDirector(active){document.body.classList.toggle('director-mode',active);if(active){if(tearOpen)setTear(false);if(pd.open)pd.close();$('#command-dialog').close();startArchiveOrbit();}else stopArchiveOrbit();dirty=true;schedule();}
  directorCommand.addEventListener('click',()=>setDirector(true));$('.director-exit').addEventListener('click',()=>setDirector(false));
  addEventListener('site:director',()=>setDirector(!document.body.classList.contains('director-mode')));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('director-mode'))setDirector(false);});
  addEventListener('site:dimensiongate',e=>gate('peel',e.detail.active));
  function language(){$$('[data-d11-ru]').forEach(e=>e.textContent=en()?e.dataset.d11En:e.dataset.d11Ru);$$('.depth-title').forEach(e=>{const echo=e.querySelector('.depth-echo');echo.remove();echo.textContent=e.innerText;e.append(echo);});peel.setAttribute('aria-label',text('Потянуть угол реальности','Peel the corner of reality'));under.setAttribute('aria-label',text('Под поверхностью','Beneath the surface'));$('.archive-prev').setAttribute('aria-label',text('Предыдущий проект','Previous project'));$('.archive-next').setAttribute('aria-label',text('Следующий проект','Next project'));$('.archive-stage').setAttribute('aria-label',text('Пространственный архив проектов','Spatial project archive'));measure();}
  addEventListener('site:language',language);document.fonts.ready.then(measure);selectFile(0);measure();
})();
