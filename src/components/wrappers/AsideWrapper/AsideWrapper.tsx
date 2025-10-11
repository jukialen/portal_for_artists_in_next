'use client';

import { useState } from 'react';

import { FriendsListArrayType, GroupsType } from 'types/global.types';

import { Categories } from 'components/functional/atoms/Categories/Categories';
import { Groups } from 'components/functional/atoms/Groups/Groups';
import { Friends } from 'components/functional/atoms/Friends/Friends';

import styles from './AsideWrapper.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';

export const AsideWrapper = ({
  asideCategory,
  friendsAsideList,
  groupsAsideList,
}: {
  asideCategory: string;
  friendsAsideList: FriendsListArrayType[];
  groupsAsideList: GroupsType[];
}) => {
  const [open, setOpen] = useState(false);
  const [openDr, setOpenDr] = useState(false);

  const showCategories = () => setOpen(!open);

  const asideBody = () => {
    return (
      <div className={styles.rolling}>
        <div className={`${!open ? styles.afterHidden : ''} ${styles.h3}`} onClick={showCategories}>
          <h3>{asideCategory}</h3>
          <RiArrowUpSLine style={{ transform: open ? 'rotate(-180deg)' : 'rotate(0deg)' }} />
        </div>

        <div className={open ? styles.container : styles.hidden__categories}>
          <Categories />
        </div>

        <Groups groupsAsideList={groupsAsideList!} />

        <Friends friendsAsideList={friendsAsideList!} />
      </div>
    );
  };

  return (
    <>
      <aside className={styles.aside}>{asideBody()}</aside>

      {!openDr && (
        <button className={styles.aside__right} aria-label="left menu button" onClick={() => setOpenDr(!openDr)}>
          <RiArrowUpSLine />
        </button>
      )}

      <Dialog.Root open={openDr} onOpenChange={() => setOpenDr(!openDr)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Content style={{ width: undefined }} className={styles.drawer}>
            <Dialog.Description className={styles.drawerBody}>
              <div className={styles.blur}></div>

              {asideBody()}
            </Dialog.Description>
            <button className={styles.drawer__right} aria-label="right menu button" onClick={() => setOpenDr(false)}>
              <RiArrowUpSLine />
            </button>
          </Dialog.Content>
        </Portal>
      </Dialog.Root>
    </>
  );
};
