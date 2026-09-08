import { redirect } from 'next/navigation';
import SiteDocument from './site-document';

function RedirectToSpanish() { return redirect('/es'); }
export default function RootPage() { return <SiteDocument lang="es"><RedirectToSpanish /></SiteDocument>; }
