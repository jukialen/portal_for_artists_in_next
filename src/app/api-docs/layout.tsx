import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal for Artists - API Documentation',
  description: 'Interactive API documentation for Portal for Artists platform',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
