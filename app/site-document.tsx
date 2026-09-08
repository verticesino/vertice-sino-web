import { Manrope, DM_Sans } from 'next/font/google';
import './globals.css';
import './phase-b.css';

const heading = Manrope({ variable: '--font-heading', subsets: ['latin'] });
const body = DM_Sans({ variable: '--font-body', subsets: ['latin'] });

export default function SiteDocument({ children, lang }: Readonly<{ children: React.ReactNode; lang: string }>) {
  return <html lang={lang}><body className={`${heading.variable} ${body.variable}`}>{children}</body></html>;
}
