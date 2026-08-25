import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SitePage from '../site-page';
import { dictionaries, isLocale, locales } from '../i18n';

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verticesino.com');
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = dictionaries[locale];
  const canonical = new URL(`/${locale}`, siteUrl);
  const socialImage = new URL('/og.png', siteUrl);
  return { title: c.seo.title, description: c.seo.description, alternates: { canonical, languages: { 'es-AR': new URL('/es',siteUrl), 'pt-BR': new URL('/pt',siteUrl), 'zh-CN': new URL('/zh',siteUrl), 'x-default': new URL('/es',siteUrl) } }, openGraph: { title: c.seo.title, description: c.seo.description, locale: c.htmlLang.replace('-', '_'), type: 'website', url: canonical, images: [{ url: socialImage, width: 1792, height: 1024, alt: 'Vértice Sino — Conexiones industriales con criterio' }] }, twitter: { card: 'summary_large_image', title: c.seo.title, description: c.seo.description, images: [socialImage] } };
}
export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SitePage locale={locale} />;
}
