import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vértice Sino | Proveedores y tecnología industrial de China',
  description: 'Consultoría para empresas de Argentina y América Latina: búsqueda y evaluación de proveedores chinos, comparación de soluciones y vinculación industrial.',
  openGraph: { title: 'Vértice Sino | Conexiones industriales con criterio', description: 'Encontramos, evaluamos y conectamos proveedores y tecnologías de China con empresas de América Latina.', locale: 'es_AR', type: 'website' },
  icons: { icon: '/favicon.png', shortcut: '/favicon.png', apple: '/favicon.png' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
