import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import { FormForgotten } from 'components/functional/molecules/FormForgotten/FormForgotten';

export const metadata: Metadata = HeadCom('The site for resetting password.');

export default async function Forgotten({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return <FormForgotten locale={locale} />;
}
