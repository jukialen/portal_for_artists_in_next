import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { FaqItems } from 'src/components/atoms/FaqItems/FaqItems';
import { AccordionWrapper } from 'src/components/molecules/AccordionWrapper/AccordionWrapper';

import { getI18n, getScopedI18n } from 'src/locales/server';

import { HeadCom } from 'src/constants/HeadCom';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Faq site');

export default async function Faq({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const link = '#4F8DFF !important';

  const t = await getI18n();
  const tFAQ = await getScopedI18n('FAQ');
  
  return (
    <div className={styles.site}>
      <div className={styles.container}>
        <h2 className={styles.h2}>{t('Contact.toFAQHere')}</h2>
        <AccordionWrapper>
          <FaqItems textHead={tFAQ('head1')} textBody={tFAQ('body1')} />

          <FaqItems
            textHead={tFAQ('head2')}
            textBody={
              <div>
                {tFAQ('body2')}
                <Link href={`${locale}/plans`} color={link}>
                  {tFAQ('body2Link')}
                </Link>
                {tFAQ('body2dot')}
              </div>
            }
          />

          <FaqItems textHead={tFAQ('head3')} textBody={tFAQ('body3')} />

          <FaqItems textHead={tFAQ('head4')} textBody={tFAQ('body4')} />
        </AccordionWrapper>
      </div>
    </div>
  );
}
