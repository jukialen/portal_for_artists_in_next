import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setStaticParamsLocale } from 'next-international/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { Database } from 'types/database.types';
import { GroupListType, LangType } from 'types/global.types';

import { GroupList } from 'components/molecules/GroupList/GroupList';

export const metadata: Metadata = HeadCom('List of all groups');

async function getGroupsList(maxItems: number) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const groupArray: GroupListType[] = [];

  try {
    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo')
      .order('name', { ascending: false })
      .limit(maxItems);

    if (!!error) {
      console.error(error);
      return groupArray;
    }

    for (const g of data) {
      groupArray.push({
        name: g.name!,
        fileUrl: !!g.logo ? g.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
      });
    }

    return groupArray;
  } catch (e) {
    console.error('Error getting groups list', e);
  }
}

export default async function List({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const tGroups = await getScopedI18n('Groups');

  const Groups = {
    list: {
      title: tGroups('list.title'),
      all: tGroups('list.all'),
    },
    noGroups: tGroups('noGroups'),
  };

  const groupArray = await getGroupsList(30);

  return <GroupList locale={locale} Groups={Groups} groupArray={groupArray} />;
}
