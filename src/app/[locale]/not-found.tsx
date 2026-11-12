import { getI18n } from 'locales/server';
import Link from 'next/link';

import styles from './not-found.module.css';
import { getUserData } from '../../helpers/getUserData';

export default async function NotFound() {
  const t = await getI18n();

  const user = await getUserData();
  return (
    <article className={styles.notFound}>
      <h1>{t('notFound')}</h1>
      <Link href={!!user ? '/app' : '/'}>{t('Nav.home')}</Link>
    </article>
  );
}
