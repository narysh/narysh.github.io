import { useEffect, useRef, useState } from 'react';
import { content, email, type Language } from './content';

type Theme = 'dark' | 'light';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{theme === 'dark'
    ? <><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
    : <path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>}</svg>;
}

function Brand() {
  return <span className="brand-mark" aria-hidden="true">n<span>/</span></span>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const query = new URLSearchParams(location.search).get('lang');
    return query === 'en' ? 'en' : 'ru';
  });
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = content[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#10120f' : '#f5f5ef');
    try { localStorage.setItem('narysh-profile-theme', theme); } catch { /* The theme still works when storage is unavailable. */ }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
    const url = new URL(location.href);
    if (language === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
    setCopyStatus('');
  }, [language, t]);

  useEffect(() => () => { if (copyTimeout.current) clearTimeout(copyTimeout.current); }, []);

  async function copyAddress() {
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    try { await navigator.clipboard.writeText(email); setCopyStatus(t.copied); }
    catch { setCopyStatus(t.copyFailed); }
    copyTimeout.current = setTimeout(() => setCopyStatus(''), 3500);
  }

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="header page-width">
      <a className="brand" href="#top" aria-label={language === 'ru' ? 'Сергей Нарышев, начало' : 'Sergey Naryshev, home'}><Brand /><span>narysh</span></a>
      <nav aria-label={language === 'ru' ? 'Навигация' : 'Navigation'}>
        {['projects', 'about', 'contact'].map((id, i) => <a key={id} href={`#${id}`}>{t.nav[i]}</a>)}
      </nav>
      <div className="preferences">
        <div className="language-switch" role="group" aria-label="Язык / Language">
          {(['ru', 'en'] as const).map(lang => <button key={lang} type="button" lang={lang} aria-pressed={language === lang} aria-label={lang === 'ru' ? 'Русский' : 'English'} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}
        </div>
        <button className="theme-toggle" type="button" aria-label={theme === 'dark' ? t.themeLight : t.themeDark} title={theme === 'dark' ? t.themeLight : t.themeDark} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><ThemeIcon theme={theme} /></button>
      </div>
    </header>

    <main id="main" className="page-width">
      <section className="intro" id="top" aria-labelledby="intro-title">
        <div className="intro-main">
          <p className="eyebrow"><span />{t.eyebrow}</p>
          <h1 id="intro-title">{t.firstName}<br /><span>{t.lastName}</span><span className="name-period">.</span></h1>
          <p className="intro-text">{t.intro}</p>
          <div className="intro-links"><a className="primary-link" href="#contact">{t.write}<Arrow /></a><a className="quiet-link" href="https://github.com/narysh" target="_blank" rel="noreferrer">GitHub<Arrow diagonal /></a></div>
        </div>
      </section>

      <section className="section" id="projects" aria-labelledby="projects-title">
        <div className="section-heading"><h2 id="projects-title">{t.projectsTitle}</h2><p>{t.projectsIntro}</p></div>
        <div className="project-list">
          {t.projects.map((project, index) => <article className="project" key={project.id}>
            <span className="project-number" aria-hidden="true">0{index + 1}</span>
            <div className="project-info">
              <p className="project-category">{project.category}</p>
              <h3><a href={project.url} target="_blank" rel="noreferrer">{project.title}<Arrow diagonal /></a></h3>
              <p className="project-description">{project.description}</p>
              <ul className="technologies" aria-label={t.tools}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
              <div className="project-actions"><button type="button" aria-expanded={expanded === project.id} aria-controls={`details-${project.id}`} onClick={() => setExpanded(expanded === project.id ? null : project.id)}>{expanded === project.id ? t.hideDetails : t.details}<span aria-hidden="true">{expanded === project.id ? '−' : '+'}</span></button><a href={project.url} target="_blank" rel="noreferrer">{index === 0 ? t.code : t.commit}<Arrow diagonal /></a></div>
              <div className="project-details" id={`details-${project.id}`} hidden={expanded !== project.id}><p>{project.details}</p></div>
            </div>
            <p className="project-note">{project.note}</p>
          </article>)}
        </div>
      </section>

      <section className="section about-section" id="about" aria-labelledby="about-title">
        <div className="about-copy"><h2 id="about-title">{t.aboutTitle}</h2><p>{t.aboutText}</p><p>{t.hobbiesText}</p></div>
        <dl className="facts">
          <div><dt>{t.education}</dt><dd>{t.educationValue}<small>{t.educationDetail}</small></dd></div>
          <div><dt>{t.tools}</dt><dd>{t.toolsValue}</dd></div>
          <div><dt>{t.english}</dt><dd>{t.englishValue}</dd></div>
        </dl>
      </section>

      <section className="section contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-heading"><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactIntro}</p></div>
        <div className="contact-list">
          <a className="contact-row" href="https://t.me/Narisherg" target="_blank" rel="noreferrer"><span>Telegram</span><strong>@Narisherg</strong><Arrow diagonal /></a>
          <div className="contact-row mail-row"><span>{t.mail}</span><a href={`mailto:${email}`}>{email}</a><button className="copy-button" type="button" aria-label={t.copyEmail} title={t.copyEmail} onClick={copyAddress}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>
          <a className="contact-row" href="https://github.com/narysh" target="_blank" rel="noreferrer"><span>GitHub</span><strong>narysh</strong><Arrow diagonal /></a>
        </div>
        <p className="copy-status" role="status">{copyStatus}</p>
      </section>
    </main>

    <footer className="footer page-width"><span>© {new Date().getFullYear()} {t.firstName} {t.lastName}</span><a href="#top">{t.backTop}<span aria-hidden="true">↑</span></a></footer>
  </>;
}
