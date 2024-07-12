import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { getUserData } from 'helpers/getUserData';

import { LangType } from "types/global.types";

import { HeadCom } from 'constants/HeadCom';

import { ContactContainer } from 'components/molecules/ContactContainer/ContactContainer';

export const metadata: Metadata = HeadCom('Site for contact to me.');

export default async function Contact({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);
  
  const userData = await getUserData();

  return <ContactContainer locale={locale} userData={userData!} />;
}
