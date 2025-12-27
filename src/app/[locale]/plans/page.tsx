import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';

import { getUserData } from 'helpers/getUserData';
import { getSubscriptionsOptions } from 'helpers/Paddle/paddle.server';

import { HeadCom } from 'constants/HeadCom';
import { LangType, PlanDataType, PlanOtherDataType } from 'types/global.types';

import { getI18n, getScopedI18n } from 'locales/server';

import { PlansContainer } from 'components/functional/organisms/Plans/Plans';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Plans site');

export default async function Plans({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tPlans = await getScopedI18n('Plans');

  const subscriptionsOptionsList = await getSubscriptionsOptions(locale);

  const user = await getUserData();

  const freePlan: PlanDataType = {
    plan: 'FREE',
    amountMonth: 0,
    amountYear: 0,
    grLength: tPlans('grLength'),
    animLength: tPlans('animLength'),
    vidLength: tPlans('vidLength'),
    grAnimSize: tPlans('grAnimSize'),
    vidSize: tPlans('vidSize'),
    noAds: tPlans('noAds'),
    support: tPlans('support'),
    choosePlan: tPlans('choosePlan'),
  };
  const premiumPlan: PlanDataType = {
    plan: 'PREMIUM',
    amountMonth: 10,
    amountYear: 100,
    grLength: tPlans('grLength'),
    animLength: tPlans('animLength'),
    vidLength: tPlans('vidLength'),
    grAnimSize: tPlans('grAnimSizeP'),
    vidSize: tPlans('vidSizeP'),
    noAds: tPlans('noAds'),
    support: tPlans('support'),
    choosePlan: tPlans('choosePlan'),
  };
  const goldPlan: PlanDataType = {
    plan: 'GOLD',
    amountMonth: 20,
    amountYear: 200,
    grLength: tPlans('grLength'),
    animLength: tPlans('animLength'),
    vidLength: tPlans('vidLength'),
    grAnimSize: tPlans('grAnimSizeG'),
    vidSize: tPlans('vidSizeG'),
    noAds: tPlans('noAds'),
    support: tPlans('pSupport'),
    choosePlan: tPlans('choosePlan'),
  };

  const otherData: PlanOtherDataType = {
    signIn: t('Nav.signIn'),
    signUp: t('Nav.signUp'),
    id: user?.id,
    email: user?.email,
    pseudonym: user?.pseudonym,
    subscriptionsOptionsList,
    plan: user?.plan!,
    billingCycle: user?.billingCycle!,
    periodMonth: tPlans('periodMonth'),
    periodYear: tPlans('periodYear'),
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{tPlans('title')}</h2>
      <h3 className={styles.subTitle}>{tPlans('subTitle')}</h3>
      <div className={styles.plansFormats}>
        <div className={styles.plans}>
          <PlansContainer dataPlan={[freePlan, premiumPlan, goldPlan]} other={otherData} />

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
    </div>
  );
}
