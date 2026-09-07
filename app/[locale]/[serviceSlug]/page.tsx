import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeoServicePage from '../../seo-service-page';
import { getSeoServiceLanguageUrls, getSeoServicePage, seoServiceStaticParams } from '../../content/seo-service-pages';
import { productionSiteUrl } from '../../site-config';

type PageProps = { params: Promise<{ locale: string; serviceSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return seoServiceStaticParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, serviceSlug } = await params;
  const content = getSeoServicePage(locale, serviceSlug);
  if (!content) notFound();

  const canonical = `${productionSiteUrl}/${content.locale}/${content.slug}`;
  const socialImage = `${productionSiteUrl}/og.png`;
  const languageUrls = getSeoServiceLanguageUrls();

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      canonical,
      languages: {
        es: `${productionSiteUrl}${languageUrls.es}`,
        'pt-BR': `${productionSiteUrl}${languageUrls['pt-BR']}`,
      },
    },
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      type: 'website',
      locale: content.openGraphLocale,
      url: canonical,
      images: [{ url: socialImage, width: 1792, height: 1024, alt: content.seo.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo.title,
      description: content.seo.description,
      images: [socialImage],
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, serviceSlug } = await params;
  const content = getSeoServicePage(locale, serviceSlug);
  if (!content) notFound();
  return <SeoServicePage content={content} />;
}
