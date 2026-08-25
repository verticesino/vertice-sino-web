import type { MetadataRoute } from 'next';
const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verticesino.com';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['es','pt','zh'].map(locale => ({ url: `${base}/${locale}`, lastModified: new Date(), changeFrequency: 'monthly', priority: locale === 'es' ? 1 : 0.9, alternates: { languages: { 'es-AR': `${base}/es`, 'pt-BR': `${base}/pt`, 'zh-CN': `${base}/zh`, 'x-default': `${base}/es` } } }));
}
