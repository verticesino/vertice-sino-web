import { dictionaries, isLocale } from '../i18n';
import { notFound } from 'next/navigation';
import SiteDocument from '../site-document';

export default async function LocaleLayout({ children, params }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteDocument lang={dictionaries[locale].htmlLang}>{children}</SiteDocument>;
}
