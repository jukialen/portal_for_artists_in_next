import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { getUserData } from 'helpers/getUserData';

import { LangType } from 'types/global.types';

import { HeadCom } from 'constants/HeadCom';

import { ContactContainer } from 'components/functional/molecules/ContactContainer/ContactContainer';

export const metadata: Metadata = HeadCom('Site for contact to me.');

export default async function Contact({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const userData = await getUserData();

  return <ContactContainer userData={userData!} />;
}
