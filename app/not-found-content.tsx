'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const copy = {
  es: {
    label: '404 · Página no encontrada',
    title: 'Esta página no está disponible.',
    description: 'Seleccione un idioma para volver al sitio de Vértice Sino.',
    navigation: 'Seleccionar idioma',
  },
  pt: {
    label: '404 · Página não encontrada',
    title: 'Esta página não está disponível.',
    description: 'Selecione um idioma para voltar ao site da Vértice Sino.',
    navigation: 'Selecionar idioma',
  },
  zh: {
    label: '404 · 页面未找到',
    title: '此页面暂不可用。',
    description: '请选择一种语言，返回 Vértice Sino 网站。',
    navigation: '选择语言',
  },
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function NotFoundContent() {
  const pathname = usePathname();
  // The shared static 404 has no request locale. Keep its initial render stable.
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const segment = hydrated ? pathname?.split('/')[1] : undefined;
  const locale = segment === 'pt' || segment === 'zh' ? segment : 'es';
  const text = copy[locale];

  return <main className="not-found" lang={locale}>
    <span className="brand-mark">VS</span>
    <p className="eyebrow">{text.label}</p>
    <h1>{text.title}</h1>
    <p>{text.description}</p>
    <nav aria-label={text.navigation}>
      <Link className="button" href="/es">Español</Link>
      <Link className="text-link" href="/pt">Português</Link>
      <Link className="text-link" href="/zh">简体中文</Link>
    </nav>
  </main>;
}
