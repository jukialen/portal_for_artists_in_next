import { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";

import { HeadCom } from "source/constants/HeadCom";

import { FormForgotten } from "source/components/atoms/FormForgotten/FormForgotten";

export const metadata: Metadata = HeadCom('The site for resetting password.');

export default function Forgotten({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  return <FormForgotten />
}
