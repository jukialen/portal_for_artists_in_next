import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useHookSWR } from 'hooks/useHookSWR';

import { NavFormProvider } from 'providers/NavFormProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { ChoosePlanPriButton } from 'components/atoms/ChoosePlanPriButton/ChoosePlanPriButton';
import { Footer } from 'components/molecules/Footer/Footer';

import styles from './index.module.scss';
import { CheckIcon } from '@chakra-ui/icons';

export default function Pricing() {
  const { isUser } = useContext(StatusLoginContext);
  const data = useHookSWR();
  const { asPath } = useRouter();

  return (
    <NavFormProvider>
      <HeadCom path={asPath} content="Pricing site" />
      <div className={styles.container}>
        <h2 className={styles.title}>{data?.Pricing?.title}</h2>
        <h3 className={styles.subTitle}>{data?.Pricing?.subTitle}</h3>
        <div className={styles.plansFormats}>
          <div className={isUser ? styles.plans__user : styles.plans}>
            <div className={styles.box}>
              <h3 className={styles.box__title}>FREE</h3>
              <div className={styles.box__price}>
                <p>$0</p>
                <p>{data?.Pricing?.period}</p>
              </div>
              <div className={styles.list}>
                <ul>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.grLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.animLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.vidLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.grAnimSize}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.vidSize}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.noAds}</p>
                  </li>
                </ul>
              </div>
              <div className={styles.choosePlan}>
                <ChoosePlanPriButton />
              </div>
            </div>
            <div className={styles.box}>
              <h3 className={styles.box__title}>PREMIUM</h3>
              <div className={styles.box__price}>
                <p>$10</p>
                <p>{data?.Pricing?.period}</p>
              </div>
              <div className={styles.list}>
                <ul>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.grLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.animLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.vidLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.grAnimSizeP}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.vidSizeP}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.noAds}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.support}</p>
                  </li>
                </ul>
              </div>
              <div className={styles.chooseSecondPlan}>
                <ChoosePlanPriButton />
              </div>
            </div>
            <div className={styles.box}>
              <h3 className={styles.box__title}>GOLD</h3>
              <div className={styles.box__price}>
                <p>$20</p>
                <p>{data?.Pricing?.period}</p>
              </div>
              <div className={styles.list}>
                <ul>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.grLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.animLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.vidLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.grAnimSizeG}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.vidSizeG}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.noAds}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Pricing?.pSupport}</p>
                  </li>
                </ul>
              </div>
              <div className={styles.choosePlan}>
                <ChoosePlanPriButton />
              </div>
            </div>
          </div>
          <div className={styles.toFaq}>
            <p>
              {data?.Contact?.toFAQ}
              <Link href="/faq">
                <a> {data?.Contact?.toFAQHere}</a>
              </Link>
              {data?.Contact?.dot}
            </p>
          </div>
          <p className={styles.formats}>
            {data?.Pricing?.formats}.jpg, .jpeg, .png, .webp, .avif
            <br />
            {data?.Pricing?.supInfo}
            <br />
            {data?.Pricing?.pSupInfo}
          </p>
        </div>
        {!isUser && <Footer />}
      </div>
    </NavFormProvider>
  );
}
