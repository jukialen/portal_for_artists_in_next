import { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";

import { getScopedI18n } from "locales/server";

import { HeadCom } from "constants/HeadCom";

import { GroupList } from "components/molecules/GroupList/GroupList";

export const metadata: Metadata = HeadCom('List of all groups');

export default async function List({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);
  
  const tGroups = await getScopedI18n('Groups');
  
  const Groups = {
      list: {
        title: tGroups('list.title'),
        all: tGroups('list.all')
      },
      noGroups: tGroups('noGroups'),
    };
    
    return <GroupList locale={locale} Groups={Groups} />
}
