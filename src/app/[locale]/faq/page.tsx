import { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import { AccordionWrapper } from 'components/atoms/AccordionWrapper/AccordionWrapper';

import styles from './page.module.scss';


export const metadata: Metadata = HeadCom('Faq site');

export default async function Faq({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const link = '#4F8DFF !important';

  const t = await getI18n();
  const tFAQ = await getScopedI18n('FAQ');

  const items: { value: '' | number; head: string; body: string | ReactNode }[] = [
    { value: 1, head: tFAQ('head1'), body: tFAQ('body1') },
    {
      value: 2,
      head: tFAQ('head2'),
      body: (
        <div>
          {tFAQ('body2')}
          <Link href={`${locale}/plans`} color={link}>
            {tFAQ('body2Link')}
          </Link>
          {tFAQ('body2dot')}
        </div>
      ),
    },
    { value: 3, head: tFAQ('head3'), body: tFAQ('body3') },
    { value: 4, head: tFAQ('head4'), body: tFAQ('body4') },
  ];
  
  return (
    <div className={styles.site}>
      <div className={styles.container}>
        <h2 className={styles.h2}>{t('Contact.toFAQHere')}</h2>
        <AccordionWrapper items={items} />
      </div>
    </div>
  );
}
