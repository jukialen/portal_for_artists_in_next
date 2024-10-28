import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import axios from 'axios';

import { getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { backUrl, cloudFrontUrl } from 'constants/links';
import { DateObjectType, GroupListType, GroupType, LangType } from 'types/global.types';

import { dateData } from 'helpers/dateData';

import { GroupList } from 'components/molecules/GroupList/GroupList';

export const metadata: Metadata = HeadCom('List of all groups');

async function getGroupsList(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  const groups: { data: GroupType[] } = await axios.get(`${backUrl}/groups/all`, {
    params: {
      queryData: {
        orderBy: { name: 'desc' },
        limit: maxItems,
      },
    },
  });

  const groupArray: GroupListType[] = [];

  for (const _group of groups.data) {
    groupArray.push({
      name: _group.name!,
      fileUrl: !!_group.logo ? `https://${cloudFrontUrl}/${_group.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
    });
  }

  return groupArray;
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

  const dataDateObject = await dateData();

  const groupArray = await getGroupsList(30, locale, dataDateObject);

  return <GroupList locale={locale} Groups={Groups} groupArray={groupArray} />;
}
