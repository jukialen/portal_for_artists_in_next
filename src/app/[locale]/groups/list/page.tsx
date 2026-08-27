import { getLinkUrl } from 'helpers/getLinkUrl';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';

import { getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { backUrl } from 'constants/links';
import { GroupListType, LangType } from 'types/global.types';

import { GroupList } from 'components/functional/molecules/GroupList/GroupList';

export const metadata: Metadata = HeadCom('List of all groups');

async function getGroupsList(maxItems: number = 30) {
  const groupArray: GroupListType[] = [];

  try {
    const supabase = await createServer();

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
      const fileUrl = await getLinkUrl('logos', `${backUrl}/group.svg`, g.logo);

      groupArray.push({ name: g.name!, fileUrl });
    }

    return groupArray;
  } catch (e) {
    console.error('Error getting groups list', e);
    return groupArray;
  }
}

export default async function List({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const tGroups = await getScopedI18n('Groups');
  const tAside = await getScopedI18n('Aside');

  const Groups = {
    list: {
      title: tGroups('list.title'),
      all: tGroups('list.all'),
    },
    noGroups: tGroups('noGroups'),
    addingGroup: tAside('addingGroup'),
  };

  const groupArray = await getGroupsList();

  return <GroupList Groups={Groups} groupArray={groupArray} />;
}
