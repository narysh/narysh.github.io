'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
let visible = !document.hidden;
let coreVisible = true;
let burst = 0;
let animationId = 0;
let lastFrame = 0;
let sceneTime = 0;
let bulletTarget=0,bulletMix=0,codeVision=false;
const canvas = $('#core'), ctx = canvas.getContext('2d');
const coreScene = new GlyphScene(canvas);
let width = 1, height = 1, dpr = 1;
const orbit = new OrbitControl(canvas,{change:()=>draw(0),paused:()=>paused,reset:()=>{burst=0;document.body.classList.remove('disruption');}});
const chars = '01アイウエオカキクケコサシスセソタチツテト{}<>/';
const particles = [];
let segments = 0;
let dialogActive = false;
function buildCore() {
  const next = innerWidth < 700 ? 126 : 180;
  if (next === segments) return;
  segments = next; particles.length = 0;
  const rings = innerWidth < 700 ? 8 : 10;
  for (let j=0; j<rings; j++) for (let i=0; i<segments; i++) {
    const t=i/segments*Math.PI*2, a=j/rings*Math.PI*2, r=1.5+.53*Math.cos(3*t);
    particles.push({x:(r+.21*Math.cos(a))*Math.cos(2*t),y:(r+.21*Math.cos(a))*Math.sin(2*t),z:.83*Math.sin(3*t)+.21*Math.sin(a),g:(i*7+j*3)%chars.length,scatter:1.8+Math.sin((t+a)*5)*.8});
  }
  coreScene.setPoints(particles);
  $('#node-count').textContent=`${particles.length.toLocaleString('en-US')} NODES`;
}
function resize(){
  const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
  dpr=Math.min(devicePixelRatio||1,width<700?1:1.25);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);buildCore();draw(0);
}
new ResizeObserver(resize).observe(canvas);
function draw(dt){
  const frameStart=RenderKit.profile?performance.now():0;
  bulletMix+=(bulletTarget-bulletMix)*(1-Math.exp(-8*dt));
  const sceneDt=dt*(1-.94*bulletMix);
  sceneTime+=sceneDt;burst=Math.max(0,burst-sceneDt*.65);
  orbit.advance(sceneDt);
  if(!orbit.drag)orbit.yaw+=dt*bulletMix*.85;
  ctx.clearRect(0,0,width,height);
  const human=document.body.classList.contains('human');
  const cx=width*.52,cy=height*.49,scale=Math.min(width*.182,height*.18);
  const rotation=orbit.yaw,tilt=orbit.tilt+Math.sin(sceneTime*.7)*bulletMix*.1;
  // Rasterize the glyphs once; reuse a small atlas for every frame.
  for(let col=0;col<8;col++){
    const px=(col+.5)*width/8,py=(sceneTime*(12+col%5*4)+col*79)%(height+100)-50;
    RenderKit.glyph(ctx,(col*7+Math.floor(sceneTime*2))%chars.length,px,py,8,.2,human);
  }
  coreScene.render({w:width,h:height,cx,cy,base:scale,rotation,tilt,burst,time:sceneTime,human});
  const radius=Math.min(width,height)*.395;
  ctx.strokeStyle=human?'#b2482a30':'#b5ff3c20';ctx.lineWidth=.7;
  ctx.beginPath();ctx.ellipse(cx,cy,radius,radius*.96,0,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([2,10]);ctx.beginPath();ctx.ellipse(cx,cy,radius+13,(radius+13)*.96,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<4;i++){const angle=i*Math.PI/2+sceneTime*.03,x=cx+Math.cos(angle)*radius,y=cy+Math.sin(angle)*radius*.96;ctx.strokeStyle=human?'#b2482a80':'#b5ff3c90';ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();}
  if(RenderKit.profile)RenderKit.record('core',performance.now()-frameStart);
}
function coreAllowed(){return !paused&&visible&&coreVisible&&!dialogActive&&!codeVision;}
function frame(now){
  animationId=0;if(!coreAllowed())return;
  const elapsed=now-lastFrame;
  if(elapsed>=(coreScene.gl?1000/60:RenderKit.interval)-1){lastFrame=now;draw(Math.min(elapsed/1000,.1));}
  animationId=requestAnimationFrame(frame);
}
function run(){if(coreAllowed()&&!animationId){lastFrame=performance.now()-RenderKit.interval;animationId=requestAnimationFrame(frame);}}
window.addEventListener('site:bullet',e=>{bulletTarget=e.detail.active?1:0;if(bulletTarget){orbit.stop();burst=Math.max(burst,.16);}});
window.addEventListener('site:vision',e=>{codeVision=e.detail.active;if(codeVision){orbit.stop();cancelAnimationFrame(animationId);animationId=0;}else run();});
const coreDialogs=[...document.querySelectorAll('dialog')];
const dialogObserver=new MutationObserver(()=>{
  dialogActive=coreDialogs.some(d=>d.open);
  if(dialogActive){orbit.stop();cancelAnimationFrame(animationId);animationId=0;}else run();
  window.dispatchEvent(new CustomEvent('site:rendergate',{detail:{blocked:dialogActive}}));
});
coreDialogs.forEach(d=>dialogObserver.observe(d,{attributes:true,attributeFilter:['open']}));
new MutationObserver(()=>{if(coreVisible&&document.body.classList.contains('human')!==canvas.classList.contains('ink')){canvas.classList.toggle('ink',document.body.classList.contains('human'));draw(0);}}).observe(document.body,{attributes:true,attributeFilter:['class']});
function syncMotion(){if(paused)orbit.stop();document.body.classList.toggle('motion-paused',paused);const b=$('#motion-toggle');b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',window.siteText(paused?'Включить анимации':'Приостановить анимации'));b.innerHTML=window.siteText(paused?'▶ <span>ПУСК</span>':'Ⅱ <span>ПАУЗА</span>');if(paused&&animationId){cancelAnimationFrame(animationId);animationId=0;}else run();}
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;syncMotion();});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible){orbit.stop();cancelAnimationFrame(animationId);animationId=0;}else run();});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});
syncMotion();
new IntersectionObserver(entries=>{coreVisible=entries[0].isIntersecting;if(!coreVisible&&animationId){orbit.stop();cancelAnimationFrame(animationId);animationId=0;}else run();},{rootMargin:'100px'}).observe(canvas);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});
$$('.reveal').forEach(e=>observer.observe(e));
function clock(){const value=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());$('#clock').textContent=`${value} MSK`;}
clock();setInterval(clock,1000);$('#year').textContent=new Date().getFullYear();
let toastTimer;
function toast(message){const t=$('#toast');t.textContent=window.siteText(message);t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2600);}
function scramble(el){if(paused)return;let original=el.dataset.scramble;let progress=0;const interval=setInterval(()=>{original=el.dataset.scramble;el.textContent=[...original].map((c,i)=>i<progress?c:chars[Math.floor(Math.random()*chars.length)]).join('');progress+=.65;if(progress>=original.length){el.textContent=original;clearInterval(interval);}},42);}
let disruptTimer;
function disrupt(){if(paused){toast('Анимации на паузе. Нажми «ПУСК», чтобы оживить конструкт.');return;}burst=1;document.body.classList.add('disruption');$$('[data-scramble]').forEach(scramble);clearTimeout(disruptTimer);disruptTimer=setTimeout(()=>document.body.classList.remove('disruption'),750);}
$('#disrupt').addEventListener('click',disrupt);
const commands=$('#command-dialog'),projectDialog=$('#project-dialog');
function openCommands(){if(projectDialog.open)projectDialog.close();if(!commands.open)commands.showModal();}
$$('.command-trigger').forEach(b=>b.addEventListener('click',openCommands));
$$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
function goTo(id){const e=document.getElementById(id);if(!e)return;e.scrollIntoView({behavior:paused?'instant':'smooth',block:'center'});if(id==='terminal-input')e.focus({preventScroll:true});}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{commands.close();goTo(b.dataset.go);}));
$('[data-action="disrupt"]').addEventListener('click',()=>{commands.close();goTo('home');disrupt();});
document.addEventListener('keydown',e=>{const editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();commands.open?commands.close():openCommands();}else if(!editing&&e.key==='/'&&!projectDialog.open){e.preventDefault();openCommands();}else if(commands.open&&/^[1-5]$/.test(e.key)){const b=$$('.command-options button')[Number(e.key)-1];b.click();}});
const details={
 weather:{file:'FILE_001 / WEATHER PROTOCOL',title:'Weather App',body:'<p>Учебное Android-приложение с прогнозом погоды для Санкт-Петербурга. Самостоятельно реализованный проект на Kotlin.</p><ul><li>Прогноз на 7 дней и почасовой прогноз на сегодня.</li><li>Загрузка данных через Open-Meteo API и HTTP-клиент Ktor.</li><li>Кэширование в Room и показ сохранённого прогноза при ошибках сети.</li><li>Интерфейс на Jetpack Compose / Material 3, внедрение зависимостей через Hilt.</li><li>В репозитории предусмотрены JUnit / MockK, инструментальные тесты и CI для сборки и unit-тестов.</li></ul>',url:'https://sourcecraft.dev/spbu-coding-2025/weather-naryshevserg',label:'ИСХОДНЫЙ КОД НА SOURCECRAFT',note:'Визуализация телефона на сайте — дизайнерская иллюстрация, а не скриншот приложения.'},
 marline:{file:'FILE_002 / SBC AVANGARD',title:'Поиск за пределами перебора',body:'<p>Командная работа над проектом на Rust в Летней проектной школе программирования СПбГУ. Мой вклад — разработка и внедрение HeuristicInvertedSketchIndex.</p><ul><li>Фильтрация слишком частых признаков через max_df.</li><li>Отбор кандидатов по минимальному сходству Жаккара.</li><li>Обход признаков от редких к частым.</li><li>Учёт ложных совпадений и настройка порога фильтрации.</li><li>Конфигурация поиска, тесты операций индекса и граничных случаев.</li></ul><p>Команда заняла III место в конкурсе работ школы за проект «SBC AVANGARD» в июле 2026 года. Сейчас продолжаю тему оптимизации поиска базовых чанков в SBC.</p>',url:'https://github.com/maxscherbakov/sbc_algorithm/commit/ccf580adb0eb7bc0014c7c9493a37a02e78129e7',label:'ПОСМОТРЕТЬ МОЙ КОММИТ',note:'Изменения представлены в коде. Универсального ускорения или оптимальности для любых данных не заявляю.'}
};
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{const d=details[b.dataset.project];$('#project-file').textContent=d.file;$('#project-detail').innerHTML=window.siteText(`<h2>${d.title}</h2>${d.body}<a class="detail-link" href="${d.url}" target="_blank" rel="noopener noreferrer">${d.label} ↗</a><p class="detail-note">${d.note}</p>`);projectDialog.showModal();}));
const terminalOutput=$('#terminal-output');
function terminalLine(text,green=false){const p=document.createElement('p');p.textContent=window.siteText(text);if(green)p.className='terminal-green';terminalOutput.append(p);while(terminalOutput.children.length>60)terminalOutput.firstElementChild.remove();terminalOutput.scrollTop=terminalOutput.scrollHeight;}
function execute(raw){const command=raw.trim().toLowerCase();if(!command)return;terminalLine(`visitor@narysh:~$ ${raw}`,true);switch(command){
case 'help':terminalLine('dejavu    — сбой реальности');terminalLine('about     — кто за терминалом\nprojects  — открыть архив проектов\nstack     — технологии и инструменты\ncontact   — каналы связи\nmatrix    — нарушить порядок\nclear     — очистить терминал');break;
case 'about':terminalLine('Сергей Нарышев / narysh\nСПбГУ, Матмех, программная инженерия. 2 курс.\nAndroid на Kotlin. Эвристики поиска на Rust.\nАлгоритмы, сети и синхронизация между устройствами.');break;
case 'projects':terminalLine('FILE_001: Weather App / Kotlin\nFILE_002: SBC AVANGARD / Rust\nFILE_003: Оптимизации поиска базовых чанков в SBC');goTo('projects');break;
case 'stack':terminalLine('Kotlin / Jetpack Compose / Room / Hilt / Ktor\nRust / C / Git / Linux / SQL\nPython: базовый уровень. English: B2.');break;
case 'contact':terminalLine('GitHub: https://github.com/narysh\nSourceCraft: https://sourcecraft.dev/users/naryshevserg/overview');goTo('contact');break;
case 'matrix':terminalLine('There is no spoon. Только код.',true);goTo('home');disrupt();break;
case 'dejavu':window.dispatchEvent(new Event('site:dejavu'));terminalLine('A CHANGE IN THE MATRIX.',true);break;
case 'clear':terminalOutput.replaceChildren();break;
case 'whoami':terminalLine('visitor — тот, кто решил посмотреть глубже.');break;
case 'sudo':terminalLine('У реальности нет root-доступа. Начни с help.');break;
default:terminalLine(`Команда «${raw.slice(0,60)}» не найдена. Введи help.`);
}}
$('#terminal-form').addEventListener('submit',e=>{e.preventDefault();execute($('#terminal-input').value);$('#terminal-input').value='';});
$$('[data-command]').forEach(b=>b.addEventListener('click',()=>execute(b.dataset.command)));
$('#clear-terminal').addEventListener('click',()=>terminalOutput.replaceChildren());
$('#copy-profile').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('https://github.com/narysh');toast('Ссылка на GitHub скопирована.');}catch{toast('GitHub: github.com/narysh');}});
setTimeout(()=>{$$('[data-scramble]').forEach(scramble);},850);

// Dispose of the intro once, so display changes cannot replay its CSS animation.
const bootIntro=document.querySelector('.boot');
bootIntro?.addEventListener('animationend',e=>{if(e.target===bootIntro)bootIntro.remove();});
setTimeout(()=>bootIntro?.remove(),1800);
