import { getUserData } from 'helpers/getUserData';
import { getI18n } from 'locales/server';

import { Links } from 'components/ui/atoms/Links/Links';

import styles from './PlanBlock.module.scss';
import { IoIosArrowRoundForward, IoMdCheckmark } from 'react-icons/io';

type PlanBlockType = {
  amount: number;
  plan: string;
  period: string;
  grLength: string;
  animLength: string;
  vidLength: string;
  grAnimSize: string;
  vidSize: string;
  noAds: string;
  support?: string;
};

export const PlanBlock = async ({
  amount,
  plan,
  grLength,
  period,
  animLength,
  vidLength,
  grAnimSize,
  vidSize,
  noAds,
  support,
}: PlanBlockType) => {
  const userData = await getUserData();
  const t = await getI18n();

  return (
    <div className={styles.box}>
      <h3 className={styles.box__title}>{plan}</h3>
      <div className={styles.box__price}>
        <p className={styles.priceCount}>${amount}</p>
        <p className={styles.priceTime}>{period}</p>
      </div>
      <div className={styles.list}>
        <ul>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{grLength}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{animLength}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{vidLength}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{grAnimSize}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{vidSize}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{noAds}</p>
          </li>
          {!!support && (
            <li>
              <IoMdCheckmark className={styles.icon} />
              <p>{support}</p>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.choosePlan}>
        <details className={styles.openButton}>
          <summary className={styles.choose}>
            {userData?.pseudonym ? (
              <a href="/settings">
                {t('Plans.choosePlan')}
                <IoIosArrowRoundForward spacing={20} />
              </a>
            ) : (
              <>
                {t('Plans.choosePlan')}
                <IoIosArrowRoundForward spacing={20} />
              </>
            )}
          </summary>
          {!userData?.pseudonym && (
            <div className={styles.noUsersPlan}>
              <Links classLink={styles.button} hrefLink="/signin">
                {t('Nav.signIn')}
              </Links>
              <Links classLink={styles.button} hrefLink="/signup">
                {t('Nav.signUp')}
              </Links>
            </div>
          )}
        </details>
      </div>
    </div>
  );
};
