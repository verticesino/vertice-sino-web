import Image from 'next/image';
import Link from 'next/link';
import styles from './header-logo.module.css';

export default function HeaderLogo({ href }: { href: string }) {
  return <Link className={styles.logo} href={href} aria-label="Vértice Sino">
    <Image className={styles.mark} src="/brand/vs-header-mark.png" alt="" width={940} height={622} priority />
    <span className={styles.name}>VÉRTICE SINO</span>
  </Link>;
}
