import { backUrl } from 'constants/links';
import { PostsType } from 'types/global.types';

export const againPosts = async (groupId: string, lastVisible: string, maxItems: number) => {
  const params = { groupId, lastVisible, maxItems: maxItems.toString() };
  const queryString = new URLSearchParams(params).toString();

  try {
    const res: PostsType[] = await fetch(`${backUrl}/api/posts/again?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};
