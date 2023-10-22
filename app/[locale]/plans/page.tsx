import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';

import { HeadCom } from 'constants/HeadCom';

import { getI18n, getScopedI18n } from 'locales/server';

import { PlanBlock } from 'components/molecules/PlanBlock/PlanBlock';
import { PlanWrapper } from "components/organisms/PlanWrapper/PlanWrapper";

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Plans site');

export default async function Plans({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tPlans = await getScopedI18n('Plans');

  const freePlan = {
    plan: 'FREE',
    amount: 0,
    period: tPlans('period'),
    grLength: tPlans('grLength'),
    animLength: tPlans('animLength'),
    vidLength: tPlans('vidLength'),
    grAnimSize: tPlans('grAnimSize'),
    vidSize: tPlans('vidSize'),
    noAds: tPlans('noAds'),
  };

  const premiumPlan = {
    plan: 'PREMIUM',
    amount: 10,
    period: tPlans('period'),
    grLength: tPlans('grLength'),
    animLength: tPlans('animLength'),
    vidLength: tPlans('vidLength'),
    grAnimSize: tPlans('grAnimSizeP'),
    vidSize: tPlans('vidSizeP'),
    noAds: tPlans('noAds'),
    support: tPlans('support'),
  };

  const goldPlan = {
    plan: 'GOLD',
    amount: 20,
    period: tPlans('period'),
    grLength: tPlans('grLength'),
    animLength: tPlans('animLength'),
    vidLength: tPlans('vidLength'),
    grAnimSize: tPlans('grAnimSizeG'),
    vidSize: tPlans('vidSizeG'),
    noAds: tPlans('noAds'),
    support: tPlans('pSupport'),
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{tPlans('title')}</h2>
      <h3 className={styles.subTitle}>{tPlans('subTitle')}</h3>
      <div className={styles.plansFormats}>
        <PlanWrapper>
          <PlanBlock
            amount={freePlan.amount}
            plan={freePlan.plan}
            period={freePlan.period}
            grLength={freePlan.grLength}
            animLength={freePlan.animLength}
            vidLength={freePlan.vidLength}
            grAnimSize={freePlan.grAnimSize}
            vidSize={freePlan.vidSize}
            noAds={freePlan.noAds}
          />
          <PlanBlock
            amount={premiumPlan.amount}
            plan={premiumPlan.plan}
            period={premiumPlan.period}
            grLength={premiumPlan.grLength}
            animLength={premiumPlan.animLength}
            vidLength={premiumPlan.vidLength}
            grAnimSize={premiumPlan.grAnimSize}
            vidSize={premiumPlan.vidSize}
            noAds={premiumPlan.noAds}
            support={premiumPlan.support}
          />
          <PlanBlock
            amount={goldPlan.amount}
            plan={goldPlan.plan}
            period={goldPlan.period}
            grLength={goldPlan.grLength}
            animLength={goldPlan.animLength}
            vidLength={goldPlan.vidLength}
            grAnimSize={goldPlan.grAnimSize}
            vidSize={goldPlan.vidSize}
            noAds={goldPlan.noAds}
            support={goldPlan.support}
          />
        </PlanWrapper>
        <div className={styles.toFaq}>
          <p>
            {t('Contact.toFAQ')}
            <Link href="/faq">{t('Contact.toFAQHere')}</Link>
            {t('Contact.dot')}
          </p>
        </div>
        <p className={styles.formats}>
          {tPlans('formats')}.jpg, .jpeg, .png, .webp, .avif, .mp4, .webm
          <br />
          {tPlans('supInfo')}
          <br />
          {tPlans('pSupInfo')}
        </p>
      </div>
    </div>
  );
}
