'use client';

import { usePaddle } from 'helpers/Paddle/paddle.client';

import { BillingCycleType, Plan, PlanDataType, PlanOtherDataType } from 'types/global.types';

import { Links } from 'components/ui/atoms/Links/Links';

import styles from './PlanBlock.module.scss';
import { IoIosArrowRoundForward, IoMdCheckmark } from 'react-icons/io';

export const PlanBlock = ({
  dataPlan,
  other,
  billingCycle,
}: {
  dataPlan: PlanDataType;
  other: PlanOtherDataType;
  billingCycle: BillingCycleType;
}) => {
  const paddle = usePaddle();

  const updatePlan = async (plan: Plan) => {
    const selectedPlanForPriceId = other.subscriptionsOptionsList!.find(
      (p) => p.name.includes(plan) && p.billingCycle.includes(billingCycle || other.billingCycle),
    )?.id;

    paddle.openSubscriptionCheckout(selectedPlanForPriceId!, other?.id!, other?.email!, '/plans');
  };

  return (
    <div className={styles.box}>
      <h3 className={styles.box__title}>{dataPlan.plan}</h3>
      <p className={styles.priceCount}>{billingCycle === 'month' ? dataPlan.amountMonth : dataPlan.amountYear}</p>
      <div className={styles.list}>
        <ul>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{dataPlan.grLength}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{dataPlan.animLength}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{dataPlan.vidLength}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{dataPlan.grAnimSize}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{dataPlan.vidSize}</p>
          </li>
          <li>
            <IoMdCheckmark className={styles.icon} />
            <p>{dataPlan.noAds}</p>
          </li>
          {!!dataPlan.support && (
            <li>
              <IoMdCheckmark className={styles.icon} />
              <p>{dataPlan.support}</p>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.choosePlan}>
        <details className={styles.openButton}>
          <summary className={styles.choose}>
            {other.pseudonym ? (
              <a onClick={() => updatePlan(dataPlan.plan)}>
                {dataPlan.choosePlan}
                <IoIosArrowRoundForward spacing={20} />
              </a>
            ) : (
              <>
                {dataPlan.choosePlan}
                <IoIosArrowRoundForward spacing={20} />
              </>
            )}
          </summary>
          {!other.pseudonym && (
            <div className={styles.noUsersPlan}>
              <Links classLink={styles.button} hrefLink="/signin">
                {other.signIn}
              </Links>
              <Links classLink={styles.button} hrefLink="/signup">
                {other.signUp}
              </Links>
            </div>
          )}
        </details>
      </div>
    </div>
  );
};
