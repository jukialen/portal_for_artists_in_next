import { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";

import { HeadCom } from "constants/HeadCom";
import { LangType } from "types/global.types";

import { FormForgotten } from "components/molecules/FormForgotten/FormForgotten";

export const metadata: Metadata = HeadCom('The site for resetting password.');

export default function Forgotten({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  return <FormForgotten locale={locale} />
}
