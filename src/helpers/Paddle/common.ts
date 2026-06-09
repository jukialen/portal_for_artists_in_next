import { BillingCycleType, LangType, Plan, SubscriptionPricingType } from 'types/global.types';

export const getPrice = (
  subscriptions: SubscriptionPricingType[],
  billingCycle: BillingCycleType,
  name: Plan,
  locale: LangType,
): string => {
  if (name === 'FREE') {
    switch (locale) {
      case 'pl':
        return '0 PLN';
      case 'ja':
        return '0 JPY';
      default:
        return '0 USD';
    }
  }

  const subscription = subscriptions.find((s) => s.billingCycle === billingCycle && s.name === name);

  if (!subscription) return '';

  console.log('subscription get', locale, name, billingCycle, subscription);
  const priceItem =
    subscription.prices.find((p) => p.key === locale) || subscription.prices.find((p) => p.key === 'en');

  console.log('priceItem get', priceItem);
  return priceItem?.value || '';
};
