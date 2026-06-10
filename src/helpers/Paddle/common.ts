import { BillingCycleType, LangType, Plan, SubscriptionPricingType } from 'types/global.types';

export const getPrice = (
  subscriptions: SubscriptionPricingType[],
  billingCycle: BillingCycleType,
  name: Plan,
  locale: LangType,
): string => {
  const otherFreeValues: Record<Exclude<LangType, 'en'>, string> = { pl: '0 PLN', ja: '0 JPY' };

  return name === 'FREE'
    ? otherFreeValues[locale]
    : subscriptions
        .find((s) => s.billingCycle === billingCycle && s.name === name)!
        .prices.find((p) => p.key === locale)!.value;
};
