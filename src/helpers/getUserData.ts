import { UserType } from 'types/global.types';
import { backUrl } from 'constants/links';

export const getUserData = async () => {
  try {
    const res = await fetch(`${backUrl}/api/user-data`, {
      next: { revalidate: 3600 },
      credentials: 'include',
    });

    if (!res.ok) return undefined;
    return (await res.json()) as UserType;
  } catch (e) {
    console.error('Error fetching user data:', e);
    return undefined;
  }
};
