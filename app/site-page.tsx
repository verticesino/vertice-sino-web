import Link from 'next/link';
import { dictionaries, languageNames, locales, type Locale } from './i18n';
import { siteConfig } from './site-config';
import ContactForm from './contact-form';

const anchors = ['inicio', 'servicios', 'proceso', 'nosotros', 'faq', 'contacto'];
const serviceTypes: Record<Locale, string> = {
  es: 'Consultoría de compras y búsqueda de proveedores en China',
  pt: 'Consultoria de compras e busca de fornecedores na China',
  zh: '中国供应商寻源与采购咨询',
};

export default function SitePage({ locale }: { locale: Locale }) {
  const c = dictionaries[locale];
  return <main lang={c.htmlLang}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({ '@context':'https://schema.org', '@type':['Organization','ProfessionalService'], name:'Vértice Sino', url:`${siteConfig.siteUrl}/${locale}`, description:c.seo.description, areaServed:['Argentina','Brazil','Latin America'], serviceType:serviceTypes[locale] })}} />
    <header className="site-header">
      <Link className="brand brand-logo-link" href={`/${locale}#inicio`} aria-label="Vértice Sino"><img className="brand-logo" src="/vertice-sino-logo.png" alt="Vértice Sino — Business & Technology" width="575" height="119" /></Link>
      <nav className="nav" aria-label={c.menuLabel}>{c.nav.map((label,i)=><a key={label} href={`#${anchors[i]}`}>{label}</a>)}</nav>
      <div className="header-actions"><div className="language-switch" aria-label="Language selector">{locales.map(lang=><Link key={lang} href={`/${lang}`} hrefLang={dictionaries[lang].htmlLang} aria-current={lang===locale?'page':undefined}>{languageNames[lang]}</Link>)}</div><a className="button button-small" href="#contacto">{c.cta}</a></div>
      <details className="mobile-menu"><summary aria-label={c.menuLabel}><span></span><span></span></summary><nav>{c.nav.map((label,i)=><a key={label} href={`#${anchors[i]}`}>{label}</a>)}<div className="mobile-languages">{locales.map(lang=><Link key={lang} href={`/${lang}`} aria-current={lang===locale?'page':undefined}>{languageNames[lang]}</Link>)}</div></nav></details>
    </header>
    <section className="hero" id="inicio">
      <div className="hero-copy reveal"><p className="eyebrow">{c.hero.eyebrow}</p><h1>{c.hero.title}</h1><p className="hero-lead">{c.hero.lead}</p><div className="hero-actions"><a className="button" href="#contacto">{c.cta} <span>↗</span></a><a className="text-link" href="#proceso">{c.hero.process} <span>→</span></a></div></div>
      <div className="hero-visual"><div className="visual-top"><span>{c.hero.latam}</span><i></i><span>{c.hero.china}</span></div><div className="visual-core"><span className="orbit orbit-one"></span><span className="orbit orbit-two"></span><div className="core-label"><b>{c.hero.core[0]}</b><small>{c.hero.core[1]}</small></div></div><div className="visual-stats">{c.hero.stats.map(([title,text])=><div key={title}><b>{title}</b><span>{text}</span></div>)}</div></div>
      <div className="hero-note">{c.hero.note[0]}<br/>{c.hero.note[1]}</div>
    </section>
    <section className="trust-strip">{c.trust.map((text,i)=><div className="trust-item" key={text}><span>0{i+1}</span><p>{text}</p></div>)}</section>
    <section className="section services" id="servicios"><div className="section-heading"><div><p className="eyebrow">{c.services.eyebrow}</p><h2>{c.services.title}</h2></div><p>{c.services.intro}</p></div><div className="service-grid">{c.services.items.map(([title,text],i)=><article className="service-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p><i>→</i></article>)}</div></section>
    <section className="capabilities"><div className="cap-intro"><p className="eyebrow light">{c.capabilities.eyebrow}</p><h2>{c.capabilities.title}</h2><p>{c.capabilities.intro}</p></div><div className="cap-list">{c.capabilities.items.map(([title,text],i)=><div className="cap-row" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p><i>↗</i></div>)}</div></section>
    <section className="section process" id="proceso"><div className="section-heading compact"><div><p className="eyebrow">{c.process.eyebrow}</p><h2>{c.process.title}</h2></div><p>{c.process.intro}</p></div><div className="steps">{c.process.items.map(([title,text],i)=><article key={title}><span>0{i+1}</span><div className="step-line"></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="about" id="nosotros"><div className="about-graphic"><span>{c.about.graphic[0]}</span><div><b>{c.about.graphic[1]}</b><i></i><b>{c.about.graphic[2]}</b></div><span>{c.about.graphic[3]}</span></div><div className="about-copy"><p className="eyebrow">{c.about.eyebrow}</p><h2>{c.about.title}</h2>{c.about.paragraphs.map(p=><p key={p}>{p}</p>)}<a className="text-link" href="#contacto">{c.about.link} <span>→</span></a></div></section>
    <section className="scope"><p className="eyebrow">{c.scope.eyebrow}</p><h2>{c.scope.title}</h2><p className="scope-intro">{c.scope.intro}</p><div className="scope-grid">{c.scope.items.map(([bold,text])=><p key={bold}><b>{bold}</b> {text}</p>)}</div></section>
    <section className="faq section" id="faq"><div className="section-heading compact"><div><p className="eyebrow">{c.faq.eyebrow}</p><h2>{c.faq.title}</h2></div></div><div className="faq-list">{c.faq.items.map(([question,answer],i)=><details key={question}><summary><span>0{i+1}</span><h3>{question}</h3><i>+</i></summary><p>{answer}</p></details>)}</div></section>
    <section className="contact" id="contacto"><div className="contact-copy"><p className="eyebrow light">{c.contact.eyebrow}</p><h2>{c.contact.title}</h2><p>{c.contact.intro}</p>{siteConfig.whatsappUrl && <a className="whatsapp" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer"><span>WA</span><div><small>{c.contact.whatsapp[0]}</small><b>WhatsApp</b></div><i>↗</i></a>}{siteConfig.contactEmail && <a className="contact-email" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>}</div><ContactForm locale={locale} contact={c.contact} /></section>
    <footer><Link className="footer-logo-link" href={`/${locale}#inicio`} aria-label="Vértice Sino"><img className="brand-logo footer-logo" src="/vertice-sino-logo.png" alt="Vértice Sino — Business & Technology" width="575" height="119" /></Link><p>{c.footer.tagline}</p><div><a href="#servicios">{c.nav[1]}</a><a href="#proceso">{c.nav[2]}</a><a href="#faq">{c.nav[4]}</a><a href="#contacto">{c.nav[5]}</a>{siteConfig.contactEmail && <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>}</div><span>{c.footer.copyright}</span></footer>
  </main>;
}
