import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Code & Tech',
  description: 'Get in touch with the Code & Tech team for questions, collaborations or feedback.',
  alternates: { canonical: 'https://code-and-tech.halilyesilyurt.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
