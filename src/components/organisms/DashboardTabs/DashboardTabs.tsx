'use client';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { useUserData } from 'src/hooks/useUserData';

import { FriendsList } from 'src/components/molecules/FriendsList/FriendsList';
import { GroupUsers } from 'src/components/organisms/GroupUsers/GroupUsers';
import { PhotosGallery } from 'src/components/organisms/PhotosGallery/PhotosGallery';
import { AnimatedGallery } from 'src/components/organisms/AnimatedGallery/AnimatedGallery';
import { VideoGallery } from 'src/components/organisms/VideoGallery/VideoGallery';
import { ClientPortalWrapper } from 'src/components/atoms/ClientPortalWrapper/ClientPortalWrapper';

import styles from './DashboardTabs.module.scss';

export const DashboardTabs = ({
  locale,
  tDash,
}: {
  locale: string;
  tDash: { friends: string; groups: string; photos: string; animations: string; videos: string };
}) => {
  const userData = useUserData();

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  return (
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
              {tDash.friends}
            </Tab>
            <Tab
              _selected={{ borderColor: selectedColor }}
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              borderColor={borderColor}
              role="tab">
              {tDash.groups}
            </Tab>
            <Tab
              className={styles.tabForPanels}
              _selected={{ borderColor: selectedColor }}
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              borderColor={borderColor}
              role="tab">
              {tDash.photos}
            </Tab>
            <Tab
              className={styles.tabForPanels}
              _selected={{ borderColor: selectedColor }}
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              borderColor={borderColor}
              role="tab">
              {tDash.animations}
            </Tab>
            <Tab
              className={styles.tabForPanels}
              _selected={{ borderColor: selectedColor }}
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              borderColor={borderColor}
              role="tab">
              {tDash.videos}
            </Tab>
          </div>
        </div>
      </TabList>

      <TabPanels className={styles.tabPanels}>
        <TabPanel className={styles.tabPanel} role="tabpanel">
          <FriendsList id={userData?.id!} />
        </TabPanel>
        <TabPanel className={styles.tabPanel} role="tabpanel">
          <GroupUsers id={userData?.id!} />
        </TabPanel>
        <TabPanel padding={0} role="tabpanel">
          <ClientPortalWrapper>
            <PhotosGallery
              id={userData?.id}
              language={locale}
              pseudonym={userData?.pseudonym!}
              plan={userData?.plan!}
            />
          </ClientPortalWrapper>
        </TabPanel>
        <TabPanel padding={0} role="tabpanel">
          <ClientPortalWrapper>
            <AnimatedGallery
              id={userData?.id}
              language={locale}
              pseudonym={userData?.pseudonym!}
              plan={userData?.plan!}
            />
          </ClientPortalWrapper>
        </TabPanel>
        <TabPanel padding={0} role="tabpanel">
          <ClientPortalWrapper>
            <VideoGallery id={userData?.id} language={locale} pseudonym={userData?.pseudonym!} plan={userData?.plan!} />
          </ClientPortalWrapper>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
