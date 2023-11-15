'use client';

import { Divider } from '@chakra-ui/react';

import { useUserData } from 'source/hooks/useUserData';

import { DeleteAccount } from 'source/components/atoms/DeleteAccount/DeleteAccount';

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
