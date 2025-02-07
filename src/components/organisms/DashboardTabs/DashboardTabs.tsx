'use client';

import { Tabs } from '@chakra-ui/react';

import { GalleryType } from 'types/global.types';

import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { GroupUsers } from 'components/organisms/GroupUsers/GroupUsers';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';

import styles from './DashboardTabs.module.scss';

export const DashboardTabs = ({
  id,
  author,
  profilePhoto,
  tDash,
  tGallery,
  tFriends,
  firstGraphics,
  firstVideos,
  firstAnimations,
  firstFriendsList,
  firstAdminList,
  firstModsUsersList,
}: GalleryType) => {
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  const fileTabList = [tDash?.friends, tDash?.groups, tDash?.photos, tDash?.animations, tDash?.videos];

  return (
    <Tabs.Root className={styles.tabsMenu} size="sm" lazyMount fitted variant="subtle">
      <Tabs.List className={styles.topTabList} role="tablist">
        <div className={styles.account__menu}>
          <div className={styles.content}>
            {fileTabList.map((tab, index) => (
              <Tabs.Trigger
                key={index}
                className={styles.tabForPanels}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab"
                value={tab!}>
                {tab}
              </Tabs.Trigger>
            ))}
          </div>
        </div>
      </Tabs.List>

      <div className={styles.tabContents}>
        <Tabs.Content value={fileTabList[0]!} className={styles.tabContent} role="tabcontent">
          <FriendsList id={id} tFriends={tFriends!} firstFriendsList={firstFriendsList!} />
        </Tabs.Content>
        <Tabs.Content value={fileTabList[1]!} className={styles.tabContent} role="tabcontent">
          <GroupUsers id={id!} firstAdminList={firstAdminList!} firstModsUsersList={firstModsUsersList!} />
        </Tabs.Content>
        <Tabs.Content value={fileTabList[2]!} padding={0} role="tabcontent">
          <ClientPortalWrapper>
            <PhotosGallery
              id={id}
              profilePhoto={profilePhoto}
              author={author}
              tGallery={tGallery}
              firstGraphics={firstGraphics}
            />
          </ClientPortalWrapper>
        </Tabs.Content>
        <Tabs.Content value={fileTabList[3]!} padding={0} role="tabcontent">
          <ClientPortalWrapper>
            <AnimatedGallery
              id={id}
              profilePhoto={profilePhoto}
              author={author}
              tGallery={tGallery}
              firstAnimations={firstAnimations}
            />
          </ClientPortalWrapper>
        </Tabs.Content>
        <Tabs.Content value={fileTabList[4]!} padding={0} role="tabcontent">
          <ClientPortalWrapper>
            <VideoGallery
              id={id!}
              profilePhoto={profilePhoto}
              author={author!}
              tGallery={tGallery!}
              firstVideos={firstVideos}
            />
          </ClientPortalWrapper>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};
