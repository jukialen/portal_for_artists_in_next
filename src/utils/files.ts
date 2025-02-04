import { backUrl } from 'constants/links';
import { FileType } from 'types/global.types';

export const graphics = async (maxItems: number, authorId: string, step: 'first' | 'again', lastVisible?: string) => {
  const params = { authorId, maxItems: maxItems.toString() };
  const lastParams = { ...params, lastVisible };
  const queryString = new URLSearchParams(!!lastVisible ? lastParams : params).toString();

  try {
    const res: FileType[] = await fetch(`${backUrl}/en/api/files/graphics/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};

export const videosAnimations = async (
  tag: 0 | 1,
  maxItems: number,
  authorId: string,
  step: 'first' | 'again',
  lastVisible?: string,
) => {
  const params = { tag: tag.toString(), authorId, maxItems: maxItems.toString() };
  const lastParams = { ...params, lastVisible };
  const queryString = new URLSearchParams(!!lastVisible ? lastParams : params).toString();

  try {
    const res: FileType[] = await fetch(`${backUrl}/en/api/files/videos-animations/${step}?${queryString}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .catch((e) => console.error(e));

    return res;
  } catch (e) {
    console.error(e);
  }
};
