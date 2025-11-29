import { backUrl } from 'constants/links';
import { RoleType } from 'types/global.types';

//SELECT
export const roles = async (roleId: string, userId: string) => {
  const params = { roleId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return role;
  } catch (e) {
    console.error(e);
  }
};

export const getFileRoleId = async (fileId: string, userId: string) => {
  const params = { fileId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    return await fetch(`${backUrl}/api/roles/file/role-id?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));
  } catch (e) {
    console.error(e);
    return 'no id';
  }
};

//POST
export const giveRole = async (roleId: string) => {
  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles/give`, {
      method: 'POST',
      body: JSON.stringify({ roleId }),
    }).then((r) => r.json());

    return role;
  } catch (e) {
    console.error(e);
  }
};

export const groupRole = async (groupsPostsRoleId: string, userId: string) => {
  const params = { groupsPostsRoleId, userId };
  const queryString = new URLSearchParams(params).toString();

  try {
    const role: RoleType = await fetch(`${backUrl}/api/roles/group?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return role;
  } catch (e) {
    console.error(e);
  }
};
