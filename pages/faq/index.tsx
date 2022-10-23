import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Accordion, Link } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { StatusLoginContext } from 'providers/StatusLogin';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FaqItems } from 'components/atoms/FaqItems/FaqItems';
import { Footer } from 'components/molecules/Footer/Footer';

import styles from './index.module.scss';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function Faq() {
  const { isUser } = useContext(StatusLoginContext);
  const { asPath } = useRouter();
  const data = useHookSWR();

  const externalLink = '#4F8DFF !important';

  return (
    <div className={styles.site}>
      <div className={styles.container}>
        <HeadCom path={asPath} content="Faq site" />
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
                <Link href="/pricing" color={externalLink} isExternal>
                  {data?.FAQ?.body2Link}
                  <ExternalLinkIcon mx="2px" color={externalLink} />
                </Link>
                {data?.FAQ?.body2dot}
              </div>
            }
          />

          <FaqItems textHead={data?.FAQ?.head3} textBody={data?.FAQ?.body3} />

          <FaqItems textHead={data?.FAQ?.head4} textBody={data?.FAQ?.body4} />
        </Accordion>
      </div>
      {!isUser && <Footer />}
    </div>
  );
}
