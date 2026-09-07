import type { MetadataRoute } from 'next';
import { productionSiteUrl as base } from './site-config';
import { getSeoServiceLanguageUrls } from './content/seo-service-pages';
export default function sitemap(): MetadataRoute.Sitemap {
  const homepages: MetadataRoute.Sitemap = ['es','pt','zh'].map(locale => ({ url: `${base}/${locale}`, lastModified: new Date(), changeFrequency: 'monthly', priority: locale === 'es' ? 1 : 0.9, alternates: { languages: { es: `${base}/es`, 'pt-BR': `${base}/pt`, 'zh-CN': `${base}/zh`, 'x-default': `${base}/es` } } }));
  const languages = Object.fromEntries(Object.entries(getSeoServiceLanguageUrls()).map(([language, path]) => [language, `${base}${path}`]));
  return [...homepages, ...Object.values(languages).map(url => ({ url, changeFrequency: 'monthly' as const, priority: 0.8, alternates: { languages } }))];
}
