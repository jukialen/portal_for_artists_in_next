import { auth } from '../../firebase';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useUserData } from 'hooks/useUserData';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { DeleteAccount } from 'components/atoms/DeleteAccount/DeleteAccount';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { GroupUsers } from 'components/organisms/GroupUsers/GroupUsers';

import styles from './index.module.scss';
import { useRouter } from 'next/router';

export default function Account() {
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const { id, pseudonym } = useUserData();
  const { push } = useRouter();

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  if (loading) {
    return push('/');
  }

  return (
    <>
      <HeadCom path={`/account/${pseudonym}`} content="Account portal site." />

      <h2 className={styles.account__h2}>{data?.Nav?.account}</h2>

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
                {data?.Account?.aMenu?.general}
              </Tab>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Account?.aMenu?.gallery}
              </Tab>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role="tab">
                {data?.Account?.aMenu?.profile}
              </Tab>
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
            </div>
          </div>
        </TabList>

        <TabPanels className={styles.tabPanels}>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <>
              <AccountData data={data} />
              <DeleteAccount pseudonym={pseudonym} />
            </>
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <FilesUpload />
            <Tabs
              size="sm"
              isLazy
              lazyBehavior="keepMounted"
              isFitted
              variant="unstyled"
              className={styles.tabsForPanels}>
              <TabList className={styles.tabList} role="tablist">
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
              </TabList>
              <TabPanels padding={0}>
                <TabPanel padding={0} role="tabpanel">
                  <PhotosGallery user={id} data={data} pseudonym={pseudonym} />
                </TabPanel>
                <TabPanel padding={0} role="tabpanel">
                  <AnimatedGallery user={id} data={data} pseudonym={pseudonym} />
                </TabPanel>
                <TabPanel padding={0} role="tabpanel">
                  <VideoGallery user={id} data={data} pseudonym={pseudonym} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <ProfileAccount data={data} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <FriendsList uid={id} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <GroupUsers id={id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
