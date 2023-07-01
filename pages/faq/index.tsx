import { useRouter } from 'next/router';
import { Accordion, Link } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FaqItems } from 'components/atoms/FaqItems/FaqItems';

import styles from './index.module.scss';

export default function Faq() {
  const { asPath } = useRouter();
  const data = useHookSWR();

  const link = '#4F8DFF !important';

  return (
    <div className={styles.site}>
      <HeadCom path={asPath} content="Faq site" />
      <div className={styles.container}>
        <h2 className={styles.h2}>{data?.Contact?.toFAQHere}</h2>
        <Accordion
          defaultIndex={[0]}
          allowMultiple
          width="95vw"
          maxW="24rem"
          justifyContent="space-around"
          alignSelf="center"
          m="2rem 0">
          <FaqItems textHead={data?.FAQ?.head1} textBody={data?.FAQ?.body1} />

          <FaqItems
            textHead={data?.FAQ?.head2}
            textBody={
              <div>
                {data?.FAQ?.body2}
                <Link href="/plans" color={link}>
                  {data?.FAQ?.body2Link}
                </Link>
                {data?.FAQ?.body2dot}
              </div>
            }
          />

          <FaqItems textHead={data?.FAQ?.head3} textBody={data?.FAQ?.body3} />

          <FaqItems textHead={data?.FAQ?.head4} textBody={data?.FAQ?.body4} />
        </Accordion>
      </div>
    </div>
  );
}
