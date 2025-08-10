import { backUrl } from 'constants/links';
import { GroupListType, GroupUserType } from 'types/global.types';

export const nextGroupList = async (maxItems: number, lastVisible: string) => {
  const params = { maxItems: maxItems.toString(), lastVisible };
  const queryString = new URLSearchParams(params).toString();

  const res: GroupListType[] = await fetch(`${backUrl}/api/groups/list?${queryString}`, {
    method: 'GET',
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return res;
};

export const adminList = async (maxItems: number) => {
  const params = { maxItems: maxItems.toString() };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: GroupUserType[] = await fetch(`${backUrl}/api/groups/admin/list?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};

export const modsUsersList = async (maxItems: number) => {
  const params = { maxItems: maxItems.toString() };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: { members: GroupUserType[]; moderators: GroupUserType[] } = await fetch(
      `${backUrl}/api/groups/mods-users/list?${queryString}`,
      {
        method: 'GET',
      },
    )
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};
