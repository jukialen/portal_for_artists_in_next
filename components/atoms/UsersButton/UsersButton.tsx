import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { auth } from '../../../firebase';
import { addDoc } from 'firebase/firestore';
import { Avatar, IconButton, Link } from '@chakra-ui/react';

import { GroupNameType, MembersAndModeratorsType } from 'types/global.types';

import { moderators, user } from 'config/referencesFirebase';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './UsersButton.module.scss';
import group from 'public/group.svg';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';

type UsersButtonType = {
  id: string;
  name: GroupNameType;
  pseudonym: string;
  logo: string;
  admin: string;
  moderatorsArray: MembersAndModeratorsType[];
};

export const UsersButton = ({
  id,
  name,
  pseudonym,
  logo,
  admin,
  moderatorsArray,
}: UsersButtonType) => {
  const [toggleModRole, setToggleModRole] = useState(false);

  const data = useHookSWR();
  const currentUser = auth.currentUser?.uid;

  useEffect(() => {
    moderatorsArray.length > 0 &&
      moderatorsArray.map(({ cid }: MembersAndModeratorsType) =>
        cid === id ? setToggleModRole(true) : setToggleModRole(false),
      );
  }, [moderatorsArray, id]);

  const addingModerators = async (name: GroupNameType) => {
    try {
      await addDoc(moderators(name!), { moderator: user(id) });
      await setToggleModRole(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.usersButton}>
      <Avatar name={pseudonym} src={!!logo ? logo : group} />
      <NextLink href={`/user/${pseudonym}`} passHref>
        <Link>{pseudonym}</Link>
      </NextLink>
      {admin === currentUser && (
        <IconButton
          type="submit"
          aria-label={
            toggleModRole ? data?.Members?.button?.addedModAria : data?.Members?.button?.addModAria
          }
          icon={toggleModRole ? <CheckIcon /> : <AddIcon />}
          onClick={() => addingModerators(name)}
        />
      )}
    </div>
  );
};
