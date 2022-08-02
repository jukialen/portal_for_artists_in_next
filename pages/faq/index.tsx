import { useRouter } from 'next/router';
import { Accordion, Link } from '@chakra-ui/react';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FaqItems } from 'components/atoms/FaqItems/FaqItems';

import styles from './index.module.scss';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function Faq() {
  const { asPath } = useRouter();
  const backgroundColor = '#2D3748';
  const color = '#FFD068';
  const m = '2rem 0';
  
  return (
    <>
      <HeadCom path={asPath} content='Faq site' />
      
      <h2 className={styles.h2}>Częste pytania</h2>
      
      <Accordion defaultIndex={[0]} allowMultiple width='24rem' maxW='70vw' alignSelf='center' m='2rem 0'>
        
        <FaqItems
          textHead='Czy korzystanie z serwisu jest darmowe?'
          textBody='Tak. Z serwisu można korzystać za darmo. Jednak aby skorzystać z dodatkowych korzyści,
            należy wykupić plan Premium.'
          bcc={backgroundColor}
          c={color}
          m={m}
        />
        
        <FaqItems
          textHead='Jakie korzyści daje plan Premium?'
          textBody={<div>Plan Premium m. in. zapewnia priorytetowe wsparcie naszego wsparcia klienta oraz brak
            reklam. Jeśli chcesz się więcej dowiedzieć, możesz dowiedzieć się <Link href='#' color='#4F8DFF !important' isExternal>
              tutaj <ExternalLinkIcon mx='2px' color='#4F8DFF' /></Link>.</div>}
          bcc={backgroundColor}
          c={color}
          m={m}
        />
        
        <FaqItems
          textHead='Czy wykupienie usługi Premium jest potrzebne do korzystania z serwisu?'
          textBody='Nie jest potrzebne. Możesz korzystać z serwisu bez planu Premium.'
          bcc={backgroundColor}
          c={color}
          m={m}
        />
        
        <FaqItems
          textHead='Jak mogę usunąć konto?'
          textBody='Wystarczy, żę klikniesz w przycisk na dole strony swojego konta i zatwierdzisz wybór. Po zatwierdzeniu
            rozpoczyna się usuwanie wszystkich twoich danych.'
          bcc={backgroundColor}
          c={color}
          m={m}
        />
      </Accordion>
    </>
  );
};

