import type { ReactNode } from 'react';
import '../blog/editorial.css';
import '../phase3.css';

type Kind = 'projects' | 'interviews' | 'categories' | 'category' | 'search' | 'contact' | 'page';

interface EditorialPageShellProps {
  kind: Kind;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function EditorialPageShell({ kind, eyebrow, title, description, children }: EditorialPageShellProps) {
  return (
    <div className={`ct-editorial-page ct-phase3 ct-p3-${kind}`}>
      <header className="ct-p3-hero">
        <p className="ct-editorial-eyebrow">{eyebrow}</p>
        <h1>{title}<span className="ct-sage-period">.</span></h1>
        {description && <p className="ct-p3-dek">{description}</p>}
      </header>
      {children}
    </div>
  );
}
