import Link from 'next/link';
import './blog/editorial.css';
import './phase3.css';

export default function NotFound() {
  return (
    <section className="ct-editorial-page ct-phase3 ct-p3-not-found" aria-labelledby="missing-page-title">
      <p className="ct-editorial-eyebrow">CODE & TECH / ERROR 404</p>
      <h1 id="missing-page-title">That page isn&apos;t here<span className="ct-sage-period">.</span></h1>
      <p>The page may have moved, or the address might be incorrect.</p>
      <Link href="/">Back to home <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
