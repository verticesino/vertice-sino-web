import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found">
    <span className="brand-mark">VS</span>
    <p className="eyebrow">404 · Página no encontrada</p>
    <h1>Esta página no está disponible.</h1>
    <p>Seleccione un idioma para volver al sitio de Vértice Sino.</p>
    <nav aria-label="Seleccionar idioma">
      <Link className="button" href="/es">Español</Link>
      <Link className="text-link" href="/pt">Português</Link>
      <Link className="text-link" href="/zh">简体中文</Link>
    </nav>
  </main>;
}
