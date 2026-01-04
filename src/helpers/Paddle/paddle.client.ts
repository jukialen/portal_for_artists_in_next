'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

import { backUrl, paddleClientId } from 'constants/links';
import { ModeType } from 'types/global.types';

export const usePaddle = () => {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      token: paddleClientId!,
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) setPaddle(paddleInstance);
    });
  }, []);

  const openSubscriptionCheckout = (priceId: string, userId: string, email: string, previousPage: string) =>
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        allowLogout: false,
        displayMode: 'overlay',
        successUrl: `${backUrl}/api/pay/success?previousPage=${previousPage}`,
        variant: 'one-page',
        theme: localStorage.getItem('mode')! as ModeType,
        allowedPaymentMethods: [
          'alipay',
          'apple_pay',
          'google_pay',
          'paypal',
          'card',
          'kakao_pay',
          'samsung_pay',
          'south_korea_local_card',
          'naver_pay',
        ],
      },
      customer: { id: userId },
      customData: {
        id: userId,
        email,
      },
    });

  const openOneTimeCheckout = (priceId: string, userId: string, email: string) =>
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        allowLogout: false,
        displayMode: 'overlay',
        successUrl: `${backUrl}/api/pay/success`,
        variant: 'one-page',
        theme: localStorage.getItem('mode')! as ModeType,
        allowedPaymentMethods: [
          'alipay',
          'apple_pay',
          'google_pay',
          'paypal',
          'card',
          'kakao_pay',
          'samsung_pay',
          'south_korea_local_card',
          'naver_pay',
        ],
      },
      customer: { id: userId },
      customData: {
        id: userId,
        email,
      },
    });

  const closeCheckout = () => paddle?.Checkout.close();

  return {
    paddle,
    openSubscriptionCheckout,
    openOneTimeCheckout,
    closeCheckout,
  };
};
