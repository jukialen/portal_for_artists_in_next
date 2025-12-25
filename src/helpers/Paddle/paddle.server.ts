import {
  Environment,
  LogLevel,
  Paddle,
  Product,
  ProductCollection,
  Subscription,
  SubscriptionCollection,
  Transaction,
  TransactionCollection,
} from '@paddle/paddle-node-sdk';
import { paddleServerId } from '../../constants/links';

export const paddle = new Paddle(paddleServerId!, {
  environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
  logLevel: LogLevel.verbose,
});

export const getSubscriptionsList = async () => {
  const subscriptionCollection: SubscriptionCollection = paddle.subscriptions.list();

  const allItems: Subscription[] = [];

  try {
    for await (const subscription of subscriptionCollection) {
      allItems.push(subscription);
    }

    if (allItems.length === 0) console.log('No subscriptions were found.');

    return allItems;
  } catch (e) {
    console.error('Error within getAllSubscriptions:', e);
    throw e; // If you want to propagate the error
  }
};

export const getAllProducts = async () => {
  const productCollection: ProductCollection = paddle.products.list();
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

export const getTransactionsList = async () => {
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
