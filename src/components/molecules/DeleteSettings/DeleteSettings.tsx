'use client';

import { Divider } from '@chakra-ui/react';

import { useUserData } from 'src/hooks/useUserData';

import { DeleteAccount } from 'src/components/atoms/DeleteAccount/DeleteAccount';

export const DeleteSettings = () => {
  const userData = useUserData();

  return !!userData?.id ? (
    <>
      <Divider />
      <DeleteAccount />
    </>
  ) : (
    <></>
  );
};
