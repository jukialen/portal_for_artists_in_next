import { backUrl } from 'constants/links';
import { RoleType } from 'types/global.types';

export const roles = async (roleId: string, userId: string): Promise<RoleType | undefined> => {
  const params = { roleId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles?${queryString}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        return undefined;
      });

    return role;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const groupRole = async (groupsPostsRoleId: string, userId: string): Promise<RoleType | undefined> => {
  const params = { groupsPostsRoleId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles/group?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        return undefined;
      });

    return role;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
