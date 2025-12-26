'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { backUrl, paddleClientId } from '../../constants/links';
import { ModeType } from '../../types/global.types';

export const usePaddle = (priceId: string, userId: string, email: string) => {
  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();

  console.log('data', priceId, userId, email);
  console.log('paddle', paddle);

  // Download and initialize Paddle instance from CDN
  useEffect(() => {
    initializePaddle({
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      token: paddleClientId!,
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  // Callback to open a checkout
  const openSubscriptionCheckout = () =>
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        allowLogout: false,
        displayMode: 'overlay',
        successUrl: `${backUrl}/payment/success`,
        variant: 'one-page',
        theme: localStorage.getItem('mode')! as ModeType,
      },
      customer: { id: userId },
      customData: {
        id: userId,
        email,
      },
    });

  const openOneTimeCheckout = () =>
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        allowLogout: false,
        displayMode: 'overlay',
        successUrl: `${backUrl}/pay/success`,
        variant: 'one-page',
        theme: localStorage.getItem('mode')! as ModeType,
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
