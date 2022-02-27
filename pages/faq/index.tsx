import Head from "next/head";
import { useRouter } from "next/router";
import { Collapse } from 'antd';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './index.module.scss';
import { HeadCom } from '../../components/atoms/HeadCom/HeadCom';

export default function Faq() {
  const { Panel } = Collapse;
  
  const { locale, asPath } = useRouter();
  
  return (
    <section className='workspace'>
      <HeadCom path={asPath} content='Faq site' />
      
      <h2 className={styles.h2}>Częste pytania</h2>
      
      <Collapse className={styles.collapse} destroyInactivePanel={true}>
        <Panel header='Czy korzystanie z serwisu jest darmowe?' className='questions__faq' key='1'>
          <p className={styles.answers__faq}>
            Tak. Z serwisu można korzystać za darmo. Jednak aby skorzystać z dodatkowych korzyści,
            należy wykupić plan Premium.
          </p>
        </Panel>
        <Panel header='Jakie korzyści daje plan Premium?' className={styles.questions__faq} key='2'>
          <p className={styles.answers__faq}>
            Plan Premium m. in. zapewnia priorytetowe wsparcie naszego wsparcia klienta oraz brak
            reklam. Jeśli chcesz się więcej dowiedzieć, możesz dowiedzieć się <a href='#'>tutaj</a>.
          </p>
        </Panel>
        <Panel
          header='Czy wykupienie usługi Premium jest potrzebne do korzystania z serwisu?'
          key='3'
          className={styles.questions__faq}
        >
          <p className={styles.answers__faq}>
            Nie jest potrzebne. Możesz korzystać z serwisu bez planu Premium.
          </p>
        </Panel>
      </Collapse>
    </section>
  );
};

