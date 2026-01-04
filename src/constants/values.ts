import { BillingCycleType, LangType, Plan, Tags } from 'types/global.types';

export const TagConstants: Tags[] = [
  'realistic',
  'manga',
  'anime',
  'comics',
  'photographs',
  'videos',
  'animations',
  'others',
  'profile',
  'group',
];

export const locales: LangType[] = ['en', 'pl', 'ja'];
export const plans: Plan[] = ['FREE', 'PREMIUM', 'GOLD'];
export const cycles: BillingCycleType[] = ['month', 'year'];
