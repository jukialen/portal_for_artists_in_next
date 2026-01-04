import { BillingCycleType, LangType, Plan, SubscriptionPricingType } from 'types/global.types';

export const getPrice = (
  subscriptions: SubscriptionPricingType[],
  billingCycle: BillingCycleType,
  name: Plan,
  locale: LangType,
) => {
  const subscription = subscriptions.find((s) => s.billingCycle === billingCycle || s.name === name);

  // console.log('subscription get', locale, name, billingCycle, subscription);
  const priceItem = subscription!.prices.find((p) => p.key === (locale === 'ja' ? 'jp' : locale));

  // console.log('priceItem get', priceItem);
  return priceItem?.value!;
};
