import { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import styles from './page.module.css';
import { LuChevronDown } from 'react-icons/lu';

export const metadata: Metadata = HeadCom('Faq site');

export default async function Faq({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tFAQ = await getScopedI18n('FAQ');

  const items: { value: '' | number; head: string; body: string | ReactNode }[] = [
    { value: 1, head: tFAQ('head1'), body: tFAQ('body1') },
    {
      value: 2,
      head: tFAQ('head2'),
      body: (
        <>
          {tFAQ('body2')}
          <Link href="/plans">{tFAQ('body2Link')}</Link>
          {tFAQ('body2dot')}
        </>
      ),
    },
    { value: 3, head: tFAQ('head3'), body: tFAQ('body3') },
    { value: 4, head: tFAQ('head4'), body: tFAQ('body4') },
  ];

  return (
    <div className={styles.site}>
      <div className={styles.container}>
        <h2 className={styles.h2}>{t('Contact.toFAQHere')}</h2>
        <div className={styles.accordionRoot}>
          {items.map((item, i) => (
            <details key={i} id={`faq-details-${i}`} className={styles.accordionItem}>
              <summary className={styles.accordionButton}>
                <h3>{item.head}</h3>
                <LuChevronDown className={styles.chevron} />
              </summary>
              <div className={styles.accordionBody}>{item.body}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
