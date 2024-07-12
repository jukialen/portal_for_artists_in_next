'use client';

import { Divider } from '@chakra-ui/react';

import { UserType } from 'types/global.types';

import { DeleteAccount } from 'components/atoms/DeleteAccount/DeleteAccount';

export const DeleteSettings = ({ userData }: { userData: UserType }) => {
  return !!userData?.id ? (
    <>
      <Divider />
      <DeleteAccount userData={userData!} />
    </>
  ) : (
    <></>
  );
};
