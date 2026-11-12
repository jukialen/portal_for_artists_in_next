import { BillingCycleType, LangType, Plan, SubscriptionPricingType } from 'types/global.types';

import { sendLokiLog } from 'helpers/Grafana/server/methods';
import { getTraceId } from 'helpers/getHeaders';
import { getScopedI18n } from 'locales/server';

export const getPrice = async (
  subscriptions: SubscriptionPricingType[],
  billingCycle: BillingCycleType,
  name: Plan,
  locale: LangType,
): Promise<string> => {
  const otherFreeValues: Record<Exclude<LangType, 'en'>, string> = { pl: '0 PLN', ja: '0 JPY' };

  if (!subscriptions || subscriptions.length === 0) {
    const tPlans = await getScopedI18n('Plans');
    await sendLokiLog('no subscription list', await getTraceId(), 'error');
    return tPlans('unavailable');
  }

  return name === 'FREE' && locale !== 'en'
    ? otherFreeValues[locale]
    : subscriptions
        .find((s) => s.billingCycle === billingCycle && s.name === name)!
        .prices.find((p) => p.key === locale)!.value;
};
