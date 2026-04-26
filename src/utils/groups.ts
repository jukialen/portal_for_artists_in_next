import { backUrl } from 'constants/links';
import { GroupListType, GroupUserType } from 'types/global.types';

export const nextGroupList = async (
  maxItems: number,
  lastVisible: string,
): Promise<GroupListType[]> => {
  const params = { maxItems: maxItems.toString(), lastVisible };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: GroupListType[] = await fetch(`${backUrl}/api/groups/list?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        return [];
      });

    return res || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const adminList = async (id: string, maxItems: number): Promise<GroupUserType[]> => {
  const params = { id, maxItems: maxItems.toString() };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: GroupUserType[] = await fetch(`${backUrl}/api/groups/admin/list?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        return [];
      });

    return res || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const modsUsersList = async (
  maxItems: number,
): Promise<{ members: GroupUserType[]; moderators: GroupUserType[] }> => {
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
      .catch((e) => {
        console.error(e);
        return { members: [], moderators: [] };
      });

    return res || { members: [], moderators: [] };
  } catch (e) {
    console.error(e);
    return { members: [], moderators: [] };
  }
};
