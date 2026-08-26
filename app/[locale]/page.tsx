import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SitePage from '../site-page';
import { dictionaries, isLocale, locales } from '../i18n';
import { productionSiteUrl } from '../site-config';

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = dictionaries[locale];
  const canonical = `${productionSiteUrl}/${locale}`;
  const socialImage = `${productionSiteUrl}/og.png`;
  return { title: c.seo.title, description: c.seo.description, alternates: { canonical, languages: { es: `${productionSiteUrl}/es`, 'pt-BR': `${productionSiteUrl}/pt`, 'zh-CN': `${productionSiteUrl}/zh`, 'x-default': `${productionSiteUrl}/es` } }, openGraph: { title: c.seo.title, description: c.seo.description, locale: c.htmlLang.replace('-', '_'), type: 'website', url: canonical, images: [{ url: socialImage, width: 1792, height: 1024, alt: 'Vértice Sino — Conexiones industriales con criterio' }] }, twitter: { card: 'summary_large_image', title: c.seo.title, description: c.seo.description, images: [socialImage] } };
}
export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SitePage locale={locale} />;
}
