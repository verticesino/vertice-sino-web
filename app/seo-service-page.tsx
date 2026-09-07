import Image from 'next/image';
import Link from 'next/link';
import { dictionaries, languageNames, locales } from './i18n';
import { siteConfig } from './site-config';
import type { SeoServicePageContent } from './content/seo-service-pages';
import { getSeoServiceLanguageUrls } from './content/seo-service-pages';

const homeAnchors = ['inicio', 'servicios', 'proceso', 'nosotros', 'faq', 'contacto'] as const;

function Paragraphs({ paragraphs }: { paragraphs?: readonly string[] }) {
  return paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

export default function SeoServicePage({ content }: { content: SeoServicePageContent }) {
  const dictionary = dictionaries[content.locale];
  const languageUrls = getSeoServiceLanguageUrls();
  const languageHref = (locale: (typeof locales)[number]) => {
    if (locale === 'es') return languageUrls.es;
    if (locale === 'pt') return languageUrls['pt-BR'];
    return '/zh';
  };

  return (
    <main lang={content.htmlLang} className="seo-service-page">
      <header className="site-header">
        <Link className="brand brand-logo-link" href={`/${content.locale}#inicio`} aria-label="Vértice Sino">
          <Image className="brand-logo" src="/vertice-sino-logo.png" alt="Vértice Sino — Business & Technology" width={575} height={119} priority />
        </Link>
        <nav className="nav" aria-label={dictionary.menuLabel}>
          {dictionary.nav.map((label, index) => <a key={label} href={`/${content.locale}#${homeAnchors[index]}`}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language selector">
            {locales.map((locale) => <Link key={locale} href={languageHref(locale)} hrefLang={dictionaries[locale].htmlLang} aria-current={locale === content.locale ? 'page' : undefined}>{languageNames[locale]}</Link>)}
          </div>
          <a className="button button-small" href={`/${content.locale}#contacto`}>{dictionary.cta}</a>
        </div>
        <details className="mobile-menu">
          <summary aria-label={dictionary.menuLabel}><span></span><span></span></summary>
          <nav aria-label={dictionary.menuLabel}>
            {dictionary.nav.map((label, index) => <a key={label} href={`/${content.locale}#${homeAnchors[index]}`}>{label}</a>)}
            <div className="mobile-languages">
              {locales.map((locale) => <Link key={locale} href={languageHref(locale)} hrefLang={dictionaries[locale].htmlLang} aria-current={locale === content.locale ? 'page' : undefined}>{languageNames[locale]}</Link>)}
            </div>
          </nav>
        </details>
      </header>

      <article>
        <section className="seo-service-hero">
          <div className="seo-service-container seo-service-hero-grid">
            <div>
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>{content.hero.title}</h1>
            </div>
            <div className="seo-service-lead"><Paragraphs paragraphs={content.hero.paragraphs} /></div>
          </div>
        </section>

        <div className="seo-service-container seo-service-editorial-pair">
          {content.sections.map((section, index) => (
            <section className="seo-service-editorial" key={section.title}>
              <div className="seo-service-index" aria-hidden="true">0{index + 1}</div>
              <div>
                <p className="eyebrow">{section.eyebrow}</p>
                <h2>{section.title}</h2>
                <div className="seo-service-copy"><Paragraphs paragraphs={section.paragraphs} /></div>
              </div>
            </section>
          ))}
        </div>

        <section className="seo-service-comparison">
          <div className="seo-service-container">
            <div className="seo-service-section-heading">
              <div><p className="eyebrow light">{content.comparison.eyebrow}</p><h2>{content.comparison.title}</h2></div>
              <p>{content.comparison.intro}</p>
            </div>
            <div className="seo-service-comparison-list">
              {content.comparison.items?.map((item, index) => (
                <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <div className="seo-service-container seo-service-editorial-pair">
          {[content.result, content.role].map((section, index) => (
            <section className="seo-service-editorial" key={section.title}>
              <div className="seo-service-index" aria-hidden="true">0{index + 3}</div>
              <div>
                <p className="eyebrow">{section.eyebrow}</p>
                <h2>{section.title}</h2>
                <div className="seo-service-copy"><Paragraphs paragraphs={section.paragraphs} /></div>
              </div>
            </section>
          ))}
        </div>

        <section className="seo-service-use-cases">
          <div className="seo-service-container seo-service-use-cases-grid">
            <div><p className="eyebrow">{content.useCases.eyebrow}</p><h2>{content.useCases.title}</h2></div>
            <div><p>{content.useCases.intro}</p><ul>{content.useCases.list?.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>

        <section className="seo-service-related">
          <div className="seo-service-container seo-service-related-grid">
            <div><p className="eyebrow">{content.related.eyebrow}</p><h2>{content.related.title}</h2></div>
            <div><Paragraphs paragraphs={content.related.paragraphs} /><p className="seo-service-related-label">{content.related.label}</p></div>
          </div>
        </section>

        <section className="seo-service-faq">
          <div className="seo-service-container">
            <div className="seo-service-section-heading">
              <div>{content.faq.eyebrow && <p className="eyebrow">{content.faq.eyebrow}</p>}<h2>{content.faq.title}</h2></div>
            </div>
            <div className="seo-service-faq-list">
              {content.faq.items.map((item, index) => (
                <details key={item.question}>
                  <summary><span>0{index + 1}</span><h3>{item.question}</h3><i aria-hidden="true">+</i></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-service-cta">
          <div className="seo-service-container seo-service-cta-grid">
            <div><p className="eyebrow light">{content.cta.eyebrow}</p><h2>{content.cta.title}</h2></div>
            <div><Paragraphs paragraphs={content.cta.paragraphs} /><a className="button" href={`/${content.locale}#contacto`}>{content.cta.button} <span>↗</span></a></div>
          </div>
        </section>
      </article>

      <footer>
        <div className="footer-brand-copy"><strong>Vértice Sino</strong><small>{dictionary.footer.tagline}</small></div>
        <div>
          <a href={`/${content.locale}#servicios`}>{dictionary.nav[1]}</a>
          <a href={`/${content.locale}#proceso`}>{dictionary.nav[2]}</a>
          <a href={`/${content.locale}#faq`}>{dictionary.nav[4]}</a>
          <a href={`/${content.locale}#contacto`}>{dictionary.nav[5]}</a>
          {siteConfig.contactEmail && <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>}
        </div>
        <span>{dictionary.footer.copyright}</span>
      </footer>
    </main>
  );
}
