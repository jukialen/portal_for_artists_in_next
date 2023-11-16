import { MemberType } from 'types/global.types';

export const sortMembers = () => (a: MemberType, b: MemberType) => {
  const pseudonymA = a.pseudonym;
  const pseudonymB = b.pseudonym;
  if (pseudonymA < pseudonymB) {
    return -1;
  }
  if (pseudonymA > pseudonymB) {
    return 1;
  }

  return 0;
};
