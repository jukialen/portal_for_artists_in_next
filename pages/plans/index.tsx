import { useRouter } from 'next/router';
import Link from 'next/link';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { ChoosePlanPriButton } from 'components/atoms/ChoosePlanPriButton/ChoosePlanPriButton';

import styles from './index.module.scss';
import { CheckIcon } from '@chakra-ui/icons';

export default function Plans() {
  const data = useHookSWR();
  const { asPath } = useRouter();
  const { pseudonym } = useUserData();

  return (
    <>
      <HeadCom path={asPath} content="Plans site" />
      <div className={styles.container}>
        <h2 className={styles.title}>{data?.Plans?.title}</h2>
        <h3 className={styles.subTitle}>{data?.Plans?.subTitle}</h3>
        <div className={styles.plansFormats}>
          <div className={pseudonym ? styles.plans__user : styles.plans}>
            <div className={styles.box}>
              <h3 className={styles.box__title}>FREE</h3>
              <div className={styles.box__price}>
                <p>$0</p>
                <p>{data?.Plans?.period}</p>
              </div>
              <div className={styles.list}>
                <ul>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.grLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.animLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.vidLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.grAnimSize}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.vidSize}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.noAds}</p>
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
                <p>{data?.Plans?.period}</p>
              </div>
              <div className={styles.list}>
                <ul>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.grLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.animLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.vidLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.grAnimSizeP}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.vidSizeP}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.noAds}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.support}</p>
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
                <p>{data?.Plans?.period}</p>
              </div>
              <div className={styles.list}>
                <ul>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.grLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.animLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.vidLength}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.grAnimSizeG}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.vidSizeG}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.noAds}</p>
                  </li>
                  <li>
                    <CheckIcon className={styles.icon} />
                    <p>{data?.Plans?.pSupport}</p>
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
              <Link href="/faq">{data?.Contact?.toFAQHere}</Link>
              {data?.Contact?.dot}
            </p>
          </div>
          <p className={styles.formats}>
            {data?.Plans?.formats}.jpg, .jpeg, .png, .webp, .avif, .mp4, .webm
            <br />
            {data?.Plans?.supInfo}
            <br />
            {data?.Plans?.pSupInfo}
          </p>
        </div>
      </div>
    </>
  );
}
