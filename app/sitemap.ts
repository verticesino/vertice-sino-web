import type { MetadataRoute } from 'next';
import { productionSiteUrl as base } from './site-config';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['es','pt','zh'].map(locale => ({ url: `${base}/${locale}`, lastModified: new Date(), changeFrequency: 'monthly', priority: locale === 'es' ? 1 : 0.9, alternates: { languages: { es: `${base}/es`, 'pt-BR': `${base}/pt`, 'zh-CN': `${base}/zh`, 'x-default': `${base}/es` } } }));
}
