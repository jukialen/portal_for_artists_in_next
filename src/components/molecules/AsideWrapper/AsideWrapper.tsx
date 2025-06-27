'use client';

import { useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { DrawerBackdrop, DrawerBody, DrawerContent, DrawerRoot } from 'components/ui/drawer';

import { darkMode } from 'constants/links';
import { FriendsListArrayType, GroupsType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { Categories } from 'components/atoms/Categories/Categories';
import { Groups } from 'components/atoms/Groups/Groups';
import { Friends } from 'components/atoms/Friends/Friends';

import styles from './Aside.module.scss';
import { RightOutlined } from '@ant-design/icons';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';

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
  const { isMode } = useContext(ModeContext);

  const arrowIcons = '1.5rem';

  const showCategories = () => setOpen(!open);

  return (
    <>
      <aside className={isMode === darkMode ? styles.aside__dark : styles.aside}>
        <div className={styles.blur}></div>

        <div className={styles.rolling}>
          <h3 className={`${styles.h3} ${!open ? styles.afterHidden : ''}`} onClick={showCategories}>
            <p>{asideCategory}</p>
            {open ? (
              <RxTriangleUp width={arrowIcons} height={arrowIcons} />
            ) : (
              <RxTriangleDown width={arrowIcons} height={arrowIcons} />
            )}
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
          <RightOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        </button>
      )}

      <DrawerRoot placement="start" open={openDr} onOpenChange={() => setOpenDr(!openDr)}>
        <DrawerBackdrop />
        <DrawerContent style={{ width: undefined }} className={styles.drawer}>
          <DrawerBody className={styles.aside}>
            <div className={styles.blur}></div>

            <div className={styles.rolling}>
              <h3 className={`${!open ? styles.afterHidden : ''} ${styles.h3}`} onClick={showCategories}>
                <p>{asideCategory}</p>
                {open ? (
                  <RxTriangleUp width={arrowIcons} height={arrowIcons} />
                ) : (
                  <RxTriangleDown width={arrowIcons} height={arrowIcons} />
                )}
              </h3>

              <div className={open ? styles.container : styles.hidden__categories}>
                <Categories />
              </div>

              <Groups groupsAsideList={groupsAsideList!} />

              <Friends friendsAsideList={friendsAsideList!} />
            </div>

            <Button
              colorScheme="pink"
              className={styles.drawer__right}
              aria-label="right menu button"
              onClick={() => setOpenDr(false)}>
              <RightOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};
