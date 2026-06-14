import {
  Environment,
  LogLevel,
  Paddle,
  Price,
  Product,
  ProductCollection,
  Subscription,
  SubscriptionCollection,
  Transaction,
  TransactionCollection,
} from '@paddle/paddle-node-sdk';

import { paddleServerId } from 'constants/links';
import { BillingCycleType, LangType, OnetimePricingType, Plan, SubscriptionPricingType } from 'types/global.types';

export const paddle = new Paddle(paddleServerId!, {
  environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
  logLevel: LogLevel.verbose,
});

export const getSubscriptionsListPerUser = async (userId: string): Promise<Subscription[]> => {
  const subscriptionCollection: SubscriptionCollection = paddle.subscriptions.list({
    customerId: [userId],
  });
  const allItems: Subscription[] = [];

  try {
    for await (const subscription of subscriptionCollection) allItems.push(subscription);

    if (allItems.length === 0) console.log('No subscriptions were found.');

    return allItems;
  } catch (e) {
    console.error('Error within getAllSubscriptions:', e);
    throw e; // If you want to propagate the error
  }
};

const getAllProducts = async (): Promise<Product[]> => {
  const productCollection: ProductCollection = paddle.products.list({
    include: ['prices'],
  });
  const allItems: Product[] = [];

  try {
    for await (const product of productCollection) {
      allItems.push(product);
    }

    if (allItems.length === 0) {
      console.log('No products were found.');
    }

    return allItems;
  } catch (e) {
    console.error('Error within getAllProducts:', e);
    throw e; // If you want to propagate the error
  }
};

const zeroDecimalCurrencies = ['JPY', 'KRW', 'CNY', 'VND'];

const convertPrice = (currencyCode: string, price: string): string => {
  if (zeroDecimalCurrencies.includes(currencyCode.toUpperCase())) {
    return price;
  }
  const amount = parseFloat(price) / 100;
  return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2).replace('.', ',');
};

const priceString = (locale: LangType, plan: Price): { key: LangType; value: string }[] => {
  const prices: { key: LangType; value: string }[] = [
    {
      key: 'en',
      value: `${convertPrice(plan.unitPrice.currencyCode, plan.unitPrice.amount)} ${plan.unitPrice.currencyCode}`,
    },
  ];

  plan.unitPriceOverrides.forEach((u) => {
    u.countryCodes.forEach((code) => {
      prices.push({
        key: code.toLowerCase() === 'jp' ? 'ja' : (code.toLowerCase() as LangType),
        value: `${convertPrice(u.unitPrice.currencyCode, u.unitPrice.amount)} ${u.unitPrice.currencyCode}`,
      });
    });
  });

  return prices;
};

export const getSubscriptionsOptions = async (locale: LangType): Promise<SubscriptionPricingType[]> => {
  try {
    const products = await getAllProducts();
    return (
      products[1]?.prices?.map((plan) => ({
        id: plan.id,
        name: plan.name! as Plan,
        description: plan.description,
        prices: priceString(locale, plan),
        billingCycle: plan.billingCycle?.interval! as BillingCycleType,
      })) ?? []
    );
  } catch (error) {
    console.error('Error within getSubscriptionsOptions:', error);
    return [];
  }
};

export const getOneTimeOptions = async (locale: LangType): Promise<OnetimePricingType[]> => {
  try {
    const products = await getAllProducts();
    return (
      products[0]?.prices?.map((plan) => ({
        id: plan.id,
        name: plan.name! as Plan,
        description: plan.description,
        prices: priceString(locale, plan),
        customData: plan.customData!,
      })) ?? []
    );
  } catch (error) {
    console.error('Error within getOneTimeOptions:', error);
    return [];
  }
};

export const getTransactionsList = async (): Promise<void> => {
  try {
    const transactionCollection: TransactionCollection = paddle.transactions.list();

    const firstPage: Transaction[] = await transactionCollection.next();
    console.log('First page of transactions:', firstPage);

    if (transactionCollection.hasMore) {
      const secondPage: Transaction[] = await transactionCollection.next();
      console.log('Second page of transactions:', secondPage);
    } else {
      console.log('No more pages of transactions available after the first page.');
    }
  } catch (e) {
    console.error('Error fetching paginated transactions:', e);
  }
};
