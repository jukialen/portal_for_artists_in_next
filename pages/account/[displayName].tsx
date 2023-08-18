import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { GroupUsers } from 'components/organisms/GroupUsers/GroupUsers';
import { MainCurrentUserProfileData } from 'components/atoms/MainCurrentUserProfileData/MainCurrentUserProfileData';

import styles from './index.module.scss';

export default function Account() {
  const data = useHookSWR();
  const { id, pseudonym } = useUserData();

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  useCurrentUser('/signin');

  return (
    <>
      <HeadCom path={`/account/${pseudonym}`} content="Account portal site." />

      <MainCurrentUserProfileData data={data} />
      <Tabs className={styles.tabsMenu} size="sm" isLazy lazyBehavior="keepMounted" isFitted variant="unstyled">
        <TabList className={styles.topTabList} role="tablist">
          <div className={styles.account__menu}>
            <div className={styles.content}>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Account?.aMenu?.friends}
              </Tab>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Account?.aMenu?.groups}
              </Tab>
              <Tab
                className={styles.tabForPanels}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Aside?.photos}
              </Tab>
              <Tab
                className={styles.tabForPanels}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Aside?.animations}
              </Tab>
              <Tab
                className={styles.tabForPanels}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Aside?.videos}
              </Tab>
            </div>
          </div>
        </TabList>

        <TabPanels className={styles.tabPanels}>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <FriendsList id={id!} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <GroupUsers id={id!} />
          </TabPanel>
          <TabPanel padding={0} role="tabpanel">
            <PhotosGallery id={id} data={data} pseudonym={pseudonym!} />
          </TabPanel>
          <TabPanel padding={0} role="tabpanel">
            <AnimatedGallery id={id} data={data} pseudonym={pseudonym!} />
          </TabPanel>
          <TabPanel padding={0} role="tabpanel">
            <VideoGallery id={id} data={data} pseudonym={pseudonym!} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
