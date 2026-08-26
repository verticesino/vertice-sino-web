import type { MetadataRoute } from 'next';
import { productionSiteUrl as base } from './site-config';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: `${base}/sitemap.xml`, host: base }; }
