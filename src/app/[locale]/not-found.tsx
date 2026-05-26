import { getI18n } from 'locales/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getI18n();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{t('notFound')}</h1>
      <Link href="/">{t('Nav.home')}</Link>
    </div>
  );
}
