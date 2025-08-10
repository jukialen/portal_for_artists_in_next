import { backUrl } from 'constants/links';
import { FriendsListType } from 'types/global.types';

export const getFirstFriends = async (id: string, maxItems: number) => {
  const params = { maxItems: maxItems.toString(), usernameId: id };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: FriendsListType[] = await fetch(`${backUrl}/api/friends/first?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};
