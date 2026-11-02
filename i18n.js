(() => {
  'use strict';
  const entries = [
    ['NARYSH — По ту сторону интерфейса','NARYSH — Beyond the interface'],
    ['Сергей Нарышев. Android-разработка, Rust и алгоритмы. Личное пространство по ту сторону интерфейса.','Sergey Naryshev. Android development, Rust and algorithms. A personal space beyond the interface.'],
    ['К содержимому','Skip to content'],['Narysh, начало','Narysh, home'],['Разделы','Navigation'],
    ['ОПЕРАТОР','OPERATOR'],['АРХИВ','ARCHIVE'],['СВЯЗЬ','CONTACT'],['Визуальный режим','Visual mode'],
    ['Открыть меню команд','Open command menu'],['ЛИЧНОСТЬ ПОДТВЕРЖДЕНА','IDENTITY VERIFIED'],
    ['ПО ТУ СТОРОНУ ИНТЕРФЕЙСА','BEYOND THE INTERFACE'],['СЕРГЕЙ','SERGEY'],['НАРЫШЕВ','NARYSHEV'],
    ['СЕРГЕЙ НАРЫШЕВ','SERGEY NARYSHEV'],['Сергей Нарышев','Sergey Naryshev'],
    ['Создаю приложения.','I build applications.'],['Разбираюсь в алгоритмах.','I explore algorithms.'],['Не принимаю систему как данность.','I question how the system works.'],
    ['ВОЙТИ В КОНСТРУКТ','ENTER THE CONSTRUCT'],['Интерактивный трёхмерный узел из цифровых символов. Вращается за курсором.','An interactive 3D knot made of digital glyphs. Rotates with your pointer.'],
    ['[ НАРУШИТЬ ПОРЯДОК ↗ ]','[ DISRUPT THE ORDER ↗ ]'],['ПРОКРУТИ, ЧТОБЫ УВИДЕТЬ БОЛЬШЕ','SCROLL TO EXPLORE'],
    ['[ 01 / ОПЕРАТОР ]','[ 01 / OPERATOR ]'],['НЕ ПРОСТО ПОЛЬЗОВАТЕЛЬ.','MORE THAN A USER.'],
    ['ТОТ, КТО','THE ONE WHO'],['ПИШЕТ','WRITES'],['ПРАВИЛА.','THE RULES.'],
    ['Мне интересно, что происходит','I want to understand what happens'],['под поверхностью.','beneath the surface.'],
    ['Как интерфейс отвечает на касание. Как алгоритм находит нужное среди миллионов вариантов. Как данные остаются с тобой на любом устройстве.','How an interface responds to a touch. How an algorithm finds a match among millions of possibilities. How your data stays with you across devices.'],
    ['Учусь на программной инженерии в СПбГУ. Создаю Android-приложения на Kotlin и исследую эвристики поиска базовых чанков на Rust.','I study Software Engineering at St Petersburg University. I build Android apps in Kotlin and research base-chunk search heuristics in Rust.'],
    ['СИСТЕМА','INSTITUTION'],['СПбГУ / Матмех','SPbU / Mathematics & Mechanics'],['СТАТУС','STATUS'],['2 курс · выпуск 2029','Year 2 · graduating in 2029'],['ФОКУС','FOCUS'],['Android & алгоритмы','Android & algorithms'],['ЯЗЫК СВЯЗИ','LANGUAGES'],['Русский / English B2','Russian / English B2'],
    ['// Хороший интерфейс понятен без инструкции.','// A good interface needs no manual.'],['// Хороший алгоритм хочется понять изнутри.','// A good algorithm makes you want to look inside.'],
    ['[ 02 / АРХИВ ПРОЕКТОВ ]','[ 02 / PROJECT ARCHIVE ]'],['ВЫХОД','STEP'],['В','INTO'],['РЕАЛЬНОСТЬ.','REALITY.'],['Идеи обретают форму,','Ideas take shape'],['когда превращаются в код.','when they become code.'],
    ['УЧЕБНЫЙ ПРОЕКТ','STUDENT PROJECT'],['ПОГОДА ВНЕ СИСТЕМЫ','WEATHER BEYOND THE SYSTEM'],
    ['Семь дней вперёд. Почасовой прогноз. Данные, которые остаются доступны даже без сети.','Seven days ahead. Hourly forecasts. Data that stays available even when you go offline.'],
    ['ДЕШИФРОВАТЬ ПРОЕКТ','DECRYPT PROJECT'],['САНКТ-ПЕТЕРБУРГ','SAINT PETERSBURG'],['ОБЛАЧНО / ЧУВСТВУЕТСЯ КАК +9°','CLOUDY / FEELS LIKE +9°'],['UI CONCEPT / ИЛЛЮСТРАЦИЯ ПРОЕКТА','UI CONCEPT / PROJECT ILLUSTRATION'],
    ['ПОРЯДОК В ХАОСЕ ДАННЫХ','ORDER IN DATA CHAOS'],
    ['Эвристики, которые помогают искать похожие чанки. Настраиваемый индекс. Алгоритмы вместо полного перебора.','Heuristics for finding similar chunks. A configurable index. A way beyond exhaustive search.'],
    ['III МЕСТО В СОСТАВЕ КОМАНДЫ','3RD PLACE AS PART OF A TEAM'],['Летняя проектная школа программирования СПбГУ / 2026','SPbU Summer Project School in Programming / 2026'],
    ['ТЕКУЩАЯ УЧЕБНАЯ РАБОТА','CURRENT ACADEMIC PROJECT'],['Оптимизации поиска','Optimizing the search'],['базовых чанков в SBC','for base chunks in SBC'],
    ['[ 03 / ИНСТРУМЕНТАРИЙ ]','[ 03 / TOOLKIT ]'],['Эвристики поиска','Search heuristics'],['Структуры данных','Data structures'],['Python / базовый','Python / basic'],
    ['ТЫ УЖЕ ВНУТРИ.','YOU ARE ALREADY INSIDE.'],['ТВОЙ ХОД','YOUR MOVE'],['У этого сайта есть командная строка.','This site has a command line.'],['Попробуй','Try'],['или','or'],
    ['Очистить терминал','Clear terminal'],['Соединение установлено. Введи','Connection established. Type'],[', чтобы осмотреться.',' to explore.'],['Команда терминала','Terminal command'],['введи команду…','enter a command…'],['Выполнить команду','Run command'],
    ['[ 04 / ОТКРЫТЫЙ КАНАЛ ]','[ 04 / OPEN CHANNEL ]'],['ЕСТЬ ИНТЕРЕСНАЯ ЗАДАЧА?','HAVE AN INTERESTING CHALLENGE?'],['ДАВАЙ','LET’S'],['НАПИШЕМ.','BUILD IT.'],['СКОПИРОВАТЬ ССЫЛКУ','COPY PROFILE LINK'],['НАВЕРХ ↑','BACK TO TOP ↑'],
    ['Настройки анимации','Animation settings'],['Приостановить анимации','Pause animations'],['Включить анимации','Enable animations'],['ПАУЗА','PAUSE'],['ПУСК','PLAY'],
    ['Закрыть меню команд','Close command menu'],['КУДА НАПРАВИМСЯ?','WHERE SHALL WE GO?'],['Об операторе','About the operator'],['Архив проектов','Project archive'],['Открыть канал связи','Open a connection'],['Командная строка','Command line'],['Нарушить порядок','Disrupt the order'],['ESC — ВЕРНУТЬСЯ В РЕАЛЬНОСТЬ','ESC — BACK TO REALITY'],['Закрыть описание проекта','Close project details'],
    ['Путешествие сквозь код: от цифрового узла к проектам','A journey through code: from a digital knot to real projects'],['[ ПЕРЕХОД В РЕАЛЬНОСТЬ ]','[ TRANSITION TO REALITY ]'],['СКРОЛЛ — ТВОЯ КАМЕРА','SCROLL IS YOUR CAMERA'],['СКВОЗЬ','THROUGH'],['КОД.','CODE.'],['Всё начинается с идеи.','Everything starts with an idea.'],['Продолжай прокрутку.','Keep scrolling.'],
    ['СЕГОДНЯ · ПОЧАСОВОЙ ПРОГНОЗ','TODAY · HOURLY FORECAST'],['01 / КОД','01 / CODE'],['02 / ИНТЕРФЕЙС','02 / INTERFACE'],['03 / АЛГОРИТМ','03 / ALGORITHM'],['ПРОДОЛЖАЙ ↓','KEEP SCROLLING ↓'],['К ПРОЕКТАМ ↘','SKIP TO PROJECTS ↘'],['Этап 1: код','Stage 1: code'],['Этап 2: интерфейс','Stage 2: interface'],['Этап 3: алгоритм','Stage 3: algorithm'],
    ['В ФОРМУ','INTO'],['ОПЫТА.','EXPERIENCE.'],['Символы становятся интерфейсом.','Symbols become an interface.'],['ДО СУТИ','TO THE CORE'],['ДАННЫХ.','OF DATA.'],['Интерфейс уходит. Остаётся алгоритм.','The interface fades. The algorithm remains.'],['Rust / SBC / эвристический поиск','Rust / SBC / heuristic search'],
    ['[ ЭКСПЕРИМЕНТ / СВОБОДА ВОЛИ ]','[ EXPERIMENT / FREE WILL ]'],['Ты управляешь интерфейсом. Нажми, чтобы рассыпать и собрать надпись.','You control the interface. Click to scatter and reassemble the letters.'],
    ['ДВИГАЙ КУРСОРОМ. НАЖМИ, ЧТОБЫ ОТПУСТИТЬ.','MOVE YOUR POINTER. CLICK TO LET GO.'],['ПОРЯДОК МОЖНО СОБРАТЬ ЗАНОВО.','ORDER CAN BE REBUILT.'],['КОНТРОЛЬ У ТЕБЯ. ДВИЖЕНИЕ ОСТАНОВЛЕНО.','YOU ARE IN CONTROL. MOTION IS PAUSED.'],['ОТПУСКАЕМ КОНТРОЛЬ. СОБИРАЕМ СМЫСЛ ЗАНОВО.','LETTING GO. PUTTING MEANING BACK TOGETHER.'],['КОСНИСЬ НАДПИСИ, ЧТОБЫ ПОВТОРИТЬ.','TAP THE WORDS TO TRY AGAIN.'],['ПОРЯДОК ВОССТАНОВЛЕН. МОЖНО ПОВТОРИТЬ.','ORDER RESTORED. TRY AGAIN.'],['КОСНИСЬ НАДПИСИ, ЧТОБЫ ОТПУСТИТЬ КОНТРОЛЬ.','TAP THE WORDS TO LET GO OF CONTROL.'],
    ['Анимации на паузе. Нажми «ПУСК», чтобы оживить конструкт.','Animations are paused. Press PLAY to bring the construct to life.'],['Ссылка на GitHub скопирована.','GitHub profile link copied.'],
    ['Учебное Android-приложение с прогнозом погоды для Санкт-Петербурга. Самостоятельно реализованный проект на Kotlin.','A student Android weather app for Saint Petersburg, independently implemented in Kotlin.'],
    ['Прогноз на 7 дней и почасовой прогноз на сегодня.','A seven-day forecast and an hourly forecast for today.'],['Загрузка данных через Open-Meteo API и HTTP-клиент Ktor.','Weather data from the Open-Meteo API, using the Ktor HTTP client.'],['Кэширование в Room и показ сохранённого прогноза при ошибках сети.','Room caching and access to saved forecasts when network requests fail.'],['Интерфейс на Jetpack Compose / Material 3, внедрение зависимостей через Hilt.','Jetpack Compose / Material 3 UI, with dependency injection through Hilt.'],['В репозитории предусмотрены JUnit / MockK, инструментальные тесты и CI для сборки и unit-тестов.','The repository includes JUnit / MockK, instrumented tests and CI for builds and unit tests.'],['ИСХОДНЫЙ КОД НА SOURCECRAFT','SOURCE CODE ON SOURCECRAFT'],['Визуализация телефона на сайте — дизайнерская иллюстрация, а не скриншот приложения.','The phone visual is a design illustration, rather than a screenshot of the app.'],
    ['Поиск за пределами перебора','Search beyond brute force'],['Командная работа над проектом на Rust в Летней проектной школе программирования СПбГУ. Мой вклад — разработка и внедрение HeuristicInvertedSketchIndex.','A team Rust project at the SPbU Summer Project School in Programming. My contribution was developing and integrating HeuristicInvertedSketchIndex.'],['Фильтрация слишком частых признаков через max_df.','Filtering overly frequent features with max_df.'],['Отбор кандидатов по минимальному сходству Жаккара.','Pruning candidates using a minimum Jaccard similarity threshold.'],['Обход признаков от редких к частым.','Processing features from rarest to most frequent.'],['Учёт ложных совпадений и настройка порога фильтрации.','Tracking false positives and configuring the filtering threshold.'],['Конфигурация поиска, тесты операций индекса и граничных случаев.','Search configuration and tests for index operations and edge cases.'],['Команда заняла III место в конкурсе работ школы за проект «SBC AVANGARD» в июле 2026 года. Сейчас продолжаю тему оптимизации поиска базовых чанков в SBC.','Our team took third place in the school’s project competition with SBC AVANGARD in July 2026. I am continuing this work on optimizing base-chunk search in SBC.'],['ПОСМОТРЕТЬ МОЙ КОММИТ','VIEW MY COMMIT'],['Изменения представлены в коде. Универсального ускорения или оптимальности для любых данных не заявляю.','The implementation is available in the linked commit. Performance depends on the data and configuration.'],
    ['about     — кто за терминалом\nprojects  — открыть архив проектов\nstack     — технологии и инструменты\ncontact   — каналы связи\nmatrix    — нарушить порядок\nclear     — очистить терминал','about     — who is behind the terminal\nprojects  — open the project archive\nstack     — technologies and tools\ncontact   — connection channels\nmatrix    — disrupt the order\nclear     — clear the terminal'],
    ['Сергей Нарышев / narysh\nСПбГУ, Матмех, программная инженерия. 2 курс.\nAndroid на Kotlin. Эвристики поиска на Rust.\nАлгоритмы, сети и синхронизация между устройствами.','Sergey Naryshev / narysh\nSPbU, Mathematics & Mechanics, Software Engineering. Year 2.\nAndroid in Kotlin. Search heuristics in Rust.\nAlgorithms, networks and cross-device synchronization.'],
    ['FILE_001: Weather App / Kotlin\nFILE_002: SBC AVANGARD / Rust\nFILE_003: Оптимизации поиска базовых чанков в SBC','FILE_001: Weather App / Kotlin\nFILE_002: SBC AVANGARD / Rust\nFILE_003: Optimizing base-chunk search in SBC'],
    ['Kotlin / Jetpack Compose / Room / Hilt / Ktor\nRust / C / Git / Linux / SQL\nPython: базовый уровень. English: B2.','Kotlin / Jetpack Compose / Room / Hilt / Ktor\nRust / C / Git / Linux / SQL\nPython: basic. English: B2.'],
    ['There is no spoon. Только код.','There is no spoon. Just code.'],['visitor — тот, кто решил посмотреть глубже.','visitor — someone who chose to look deeper.'],['У реальности нет root-доступа. Начни с help.','Reality has no root access. Start with help.']
  ];
  entries.push(['ВРАЩАЙ ПЕРЕТАСКИВАНИЕМ · ДВОЙНОЕ НАЖАТИЕ — СБРОС','DRAG TO ROTATE · DOUBLE TAP TO RESET'],['Интерактивный трёхмерный узел. Перетаскивайте для вращения. Двойное нажатие — собрать заново. Стрелки — вращение, Home — сброс.','Interactive 3D knot. Drag to rotate. Double tap to reassemble. Arrow keys rotate; Home resets.']);
  entries.push(['КОД','CODE'],['Удерживай, чтобы видеть код. Клавиша V.','Hold to see the code. V key.'],['Включи анимации, чтобы запустить bullet time.','Enable animations to start bullet time.'],['Bullet time. Время замедлено.','Bullet time. Time slowed down.'],['Телефонный выход','Phone exit'],['ЕСТЬ ВЫХОД.','THERE IS A WAY OUT.'],['Нужен только один звонок.','One call is all it takes.'],['ЛИНИЯ СВОБОДНА','LINE AVAILABLE'],['УСТАНОВИТЬ СОЕДИНЕНИЕ','ESTABLISH CONNECTION'],['КАНАЛ ОТКРЫТ. ТВОЙ ХОД.','CHANNEL OPEN. YOUR MOVE.'],['ЗАВЕРШИТЬ СОЕДИНЕНИЕ','END CONNECTION'],['СОЕДИНЕНИЕ УСТАНОВЛЕНО','CONNECTION ESTABLISHED'],['НАБОР НОМЕРА…','DIALING…'],['ПОИСК ВЫХОДА…','FINDING THE EXIT…'],['СБОЙ РЕАЛЬНОСТИ','REALITY GLITCH'],['Ты заметил повтор. Система тоже.','You noticed the repetition. So did the system.'],['ВЕРНУТЬСЯ','RETURN']);
  entries.push(['dejavu    — сбой реальности','dejavu    — a glitch in reality']);
  entries.push(['ВЫБРАТЬ КАНАЛ','CHOOSE A CHANNEL'],['СОЕДИНЕНИЕ…','CONNECTING…']);
  const en = new Map(entries), ru = new Map(entries.map(([a,b])=>[b,a]));
  let initial='ru';
  try {const query=new URL(location.href).searchParams.get('lang');initial=query==='en'||query==='ru'?query:localStorage.getItem('narysh-lang')||'ru';}catch{}
  window.siteLanguage=initial==='en'?'en':'ru';
  const attrs=['aria-label','placeholder','data-scramble','title'];
  function text(value){
    if(typeof value!=='string')return value;
    const current=window.siteLanguage==='en'?en:ru;
    if(current.has(value))return current.get(value);
    const key=value.trim();
    if(current.has(key))return value.replace(key,current.get(key));
    const withArrow=key.match(/^(.*?)(\s+[↗↘↑↓⧉✳])$/u);
    if(withArrow&&current.has(withArrow[1]))return value.replace(key,current.get(withArrow[1])+withArrow[2]);
    const unknown=value.match(/^Команда «(.*)» не найдена\. Введи help\.$/s);
    if(unknown&&window.siteLanguage==='en')return `Command “${unknown[1]}” not found. Type help.`;
    const back=value.match(/^Command “(.*)” not found\. Type help\.$/s);
    if(back&&window.siteLanguage==='ru')return `Команда «${back[1]}» не найдена. Введи help.`;
    return value;
  }
  function translate(root){
    const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walk.nextNode())){
      if(node.parentElement?.closest('script,style,.control-word,[data-no-translate]'))continue;
      const value=text(node.nodeValue);if(value!==node.nodeValue)node.nodeValue=value;
    }
    const elements=root.querySelectorAll?root.querySelectorAll('*'):[];
    for(const el of elements)for(const attr of attrs)if(el.hasAttribute(attr)){const old=el.getAttribute(attr),next=text(old);if(next!==old)el.setAttribute(attr,next);}
    return root;
  }
  window.siteText=value=>{
    if(typeof value!=='string')return value;
    if(value.includes('<')&&value.includes('>')){const template=document.createElement('template');template.innerHTML=value;translate(template.content);return template.innerHTML;}
    return text(value);
  };
  window.siteTranslate=translate;
  let languageButtons=[];
  function setLanguage(lang,updateUrl=true){
    window.siteLanguage=lang==='en'?'en':'ru';
    document.documentElement.lang=window.siteLanguage;
    translate(document.body);
    document.title=window.siteText('NARYSH — По ту сторону интерфейса');
    document.querySelector('meta[name="description"]').content=window.siteText('Сергей Нарышев. Android-разработка, Rust и алгоритмы. Личное пространство по ту сторону интерфейса.');
    languageButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===window.siteLanguage)));
    try{localStorage.setItem('narysh-lang',window.siteLanguage);if(updateUrl){const url=new URL(location.href);url.searchParams.set('lang',window.siteLanguage);history.replaceState(null,'',url);}}catch{}
    window.dispatchEvent(new CustomEvent('site:language',{detail:{language:window.siteLanguage}}));
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const switcher=document.createElement('div');switcher.className='language-switch';switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Language / Язык');
    switcher.innerHTML='<button type="button" data-language="ru" lang="ru" aria-label="Русский" aria-pressed="true">RU</button><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="false">EN</button>';
    document.querySelector('.mode-switch').after(switcher);
    languageButtons=[...switcher.querySelectorAll('button')];languageButtons.forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));
    setLanguage(window.siteLanguage,false);
  });
})();
