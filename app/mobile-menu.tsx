'use client';

import { useRef, type ReactNode } from 'react';

export default function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  function close() {
    if (!details.current) return;
    details.current.open = false;
    details.current.querySelector('summary')?.focus();
  }
  return <details ref={details} className="mobile-menu" onKeyDown={event => {
    if (event.key === 'Escape' && details.current?.open) { event.preventDefault(); close(); }
  }} onClick={event => {
    if (event.target instanceof Element && event.target.closest('a[href]')) close();
  }}>
    <summary aria-label={label}><span></span><span></span></summary>
    {children}
  </details>;
}
