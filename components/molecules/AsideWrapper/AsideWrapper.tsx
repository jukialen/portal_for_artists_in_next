'use client';

import { useContext, useState } from 'react';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';

import { darkMode } from 'constants/links';

import { ModeContext } from 'providers/ModeProvider';

import { Categories } from 'components/atoms/Categories/Categories';
import { Groups } from 'components/atoms/Groups/Groups';
import { Friends } from 'components/atoms/Friends/Friends';

import styles from './Aside.module.scss';
import { RightOutlined } from '@ant-design/icons';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export const AsideWrapper = ({ asideCategory }: { asideCategory: string }) => {
  const [open, setOpen] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
              <TriangleUpIcon w={arrowIcons} h={arrowIcons} />
            ) : (
              <TriangleDownIcon w={arrowIcons} h={arrowIcons} />
            )}
          </h3>

          <div className={open ? styles.container : styles.hidden__categories}>
            <Categories />
          </div>

          <Groups />

          <Friends />
        </div>
      </aside>

      {!isOpen && (
        <button className={styles.aside__right} aria-label="left menu button" onClick={onOpen}>
          <RightOutlined />
        </button>
      )}

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent style={{ width: undefined }} className={styles.drawer}>
          <DrawerBody className={styles.aside}>
            <div className={styles.blur}></div>

            <div className={styles.rolling}>
              <h3 className={`${!open ? styles.afterHidden : ''} ${styles.h3}`} onClick={showCategories}>
                <p>{asideCategory}</p>
                {open ? (
                  <TriangleUpIcon w={arrowIcons} h={arrowIcons} />
                ) : (
                  <TriangleDownIcon w={arrowIcons} h={arrowIcons} />
                )}
              </h3>

              <div className={open ? styles.container : styles.hidden__categories}>
                <Categories />
              </div>

              <Groups />

              <Friends />
            </div>

            <Button
              colorScheme="pink"
              className={styles.drawer__right}
              aria-label="right menu button"
              onClick={onClose}>
              <RightOutlined />
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
