import { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";

import { HeadCom } from "source/constants/HeadCom";

import { ContactContainer } from "source/components/molecules/ContactContainer/ContactContainer";

export const metadata: Metadata = HeadCom('Site for contact to me.');

export default async function Contact({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  return <ContactContainer locale={locale} />
}
