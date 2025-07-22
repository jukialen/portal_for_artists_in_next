'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { DrawerBackdrop, DrawerBody, DrawerContent, DrawerRoot } from 'components/ui/drawer';

import { FriendsListArrayType, GroupsType } from 'types/global.types';

import { Categories } from 'components/atoms/Categories/Categories';
import { Groups } from 'components/atoms/Groups/Groups';
import { Friends } from 'components/atoms/Friends/Friends';

import styles from './Aside.module.scss';
import { RiArrowUpSLine } from 'react-icons/ri';

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
  return (
    <>
      <aside className={styles.aside}>
        <div className={styles.rolling}>
          <h3 className={`${styles.h3} ${!open ? styles.afterHidden : ''}`} onClick={showCategories}>
            <p>{asideCategory}</p>
            <RiArrowUpSLine
              style={{
                transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
                display: 'inline-block',
              }}
            />
          </h3>

          <div className={open ? styles.container : styles.hidden__categories}>
            <Categories />
          </div>

          <Groups groupsAsideList={groupsAsideList} />

          <Friends friendsAsideList={friendsAsideList} />
        </div>
      </aside>

      {!openDr && (
        <button className={styles.aside__right} aria-label="left menu button" onClick={() => setOpenDr(!openDr)}>
          <RiArrowUpSLine />
        </button>
      )}

      <DrawerRoot placement="start" open={openDr} onOpenChange={() => setOpenDr(!openDr)}>
        <DrawerBackdrop />
        <DrawerContent style={{ width: undefined }} className={styles.drawer}>
          <DrawerBody className={styles.drawerBody}>
            <div className={styles.blur}></div>

            <div className={styles.rolling}>
              <h3 className={`${!open ? styles.afterHidden : ''} ${styles.h3}`} onClick={showCategories}>
                <p>{asideCategory}</p>
                <RiArrowUpSLine
                  style={{
                    transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
                    display: 'inline-block',
                  }}
                />
              </h3>

              <div className={open ? styles.container : styles.hidden__categories}>
                <Categories />
              </div>

              <Groups groupsAsideList={groupsAsideList!} />

              <Friends friendsAsideList={friendsAsideList!} />
            </div>
          </DrawerBody>
          <Button
            colorScheme="pink"
            className={styles.drawer__right}
            aria-label="right menu button"
            onClick={() => setOpenDr(false)}>
            <RiArrowUpSLine />
          </Button>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
