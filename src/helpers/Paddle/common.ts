import { BillingCycleType, LangType, Plan, SubscriptionPricingType } from 'types/global.types';

export const getPrice = (
  subscriptions: SubscriptionPricingType[],
  billingCycle: BillingCycleType,
  name: Plan,
  locale: LangType,
): string => {
  const otherFreeValues: Record<Exclude<LangType, 'en'>, string> = { pl: '0 PLN', ja: '0 JPY' };

  if (name === 'FREE') {
    return otherFreeValues[locale] || '0 USD';
  }

  const subscription = subscriptions?.find(
    (s) => s.billingCycle === billingCycle && s.name === name,
  );

  if (!subscription) {
    console.warn(`[Paddle] Subscription plan "${name}" for billing cycle "${billingCycle}" not found.`);
    return 'N/A';
  }

  const price = subscription.prices?.find((p) => p.key === locale);

  if (!price) {
    console.warn(`[Paddle] Price for locale "${locale}" not found in subscription plan "${name}".`);
    return subscription.prices?.[0]?.value || 'N/A';
  }

  return price.value;
};

