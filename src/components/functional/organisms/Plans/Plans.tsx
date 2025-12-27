'use client';
import { useState } from 'react';

import { BillingCycleType, PlanBlockType } from 'types/global.types';
import { PlanBlock } from 'components/ui/molecules/PlanBlock/PlanBlock';

import styles from './Plans.module.css';

export const PlansContainer = ({ dataPlan, other }: PlanBlockType) => {
  const [cycle, setCycle] = useState<BillingCycleType>(other.billingCycle);

  return (
    <section className={styles.plansContainer}>
      <div className={styles.cycleButtonContainer}>
        <button
          className={cycle === 'month' ? styles.cycleButton__active : styles.cycleButton}
          onClick={() => setCycle('month')}>
          {other.periodMonth}
        </button>
        <button
          className={cycle === 'year' ? styles.cycleButton__active : styles.cycleButton}
          onClick={() => setCycle('year')}>
          {other.periodYear}
        </button>
      </div>
      <div className={styles.plansDataContainer}>
        <PlanBlock dataPlan={dataPlan[0]} other={other} billingCycle={cycle} />
        <PlanBlock dataPlan={dataPlan[1]} other={other} billingCycle={cycle} />
        <PlanBlock dataPlan={dataPlan[2]} other={other} billingCycle={cycle} />
      </div>
    </section>
  );
};
