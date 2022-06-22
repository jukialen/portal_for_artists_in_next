import { auth } from '../../firebase';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useUserData } from 'hooks/useUserData';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { DeleteAccount } from 'components/atoms/DeleteAccount/DeleteAccount';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';

import styles from './index.module.scss';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { GroupUsers } from 'components/organisms/GroupUsers/GroupUsers';

export default function Account() {
  const user = auth.currentUser;
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const { pseudonym } = useUserData();
  
  const borRadius = '0 1rem/3rem';
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#4F8DFF';
  const fontMenu = '1rem';
  
  return !loading ? (
    <>
      <HeadCom path={`/account/${pseudonym || user?.displayName}`} content='Account portal site.' />
      
      <h2 className={styles.account__h2}>{data?.Nav?.account}</h2>
      
      <Tabs
        size='sm'
        align='center'
        justifySelf='center'
        maxW='100vw'
        m='0 auto'
        gap='2rem'
        isLazy
        lazyBehavior='keepMounted'
        isFitted
        variant='unstyled'
      >
        <TabList padding='1rem 0 5rem'>
          <div className={styles.account__menu}>
            <div className={styles.content}>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{  borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                {data?.Account?.aMenu?.general}
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{  borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                {data?.Account?.aMenu?.gallery}
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{  borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                {data?.Account?.aMenu?.profile}
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{  borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                Friends
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{  borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                Groups
              </Tab>
            </div>
          </div>
        </TabList>
    
        <TabPanels padding={0}>
          <TabPanel padding={0}>
            <>
              <AccountData data={data} />
              <DeleteAccount />
            </>
          </TabPanel>
          <TabPanel padding={0}>
            <FilesUpload />
            <Tabs
              size='sm'
              align='center'
              justifySelf='center'
              maxW='100vw'
              m='5rem auto'
              gap='2rem'
              isLazy
              lazyBehavior='keepMounted'
              isFitted
              variant='unstyled'
            >
              <TabList
                width='61%'
                flexWrap='wrap'
                gap='2rem'
                m='auto'
                border='none'
                role='tablist'
              >
                <Tab
                  h='2rem'
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{  borderColor: activeColor }}
                  borderColor={activeColor}
                  borderRadius={borRadius}
                  role='tab'
                >
                  Photos
                </Tab>
                <Tab
                  h='2rem'
                  _selected={{  borderColor: selectedColor }}
                  _hover={{  borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={activeColor}
                  borderRadius={borRadius}
                  role='tab'
                >
                  Animations
                </Tab>
                <Tab
                  h='2rem'
                  _selected={{ borderColor: selectedColor }}
                  _hover={{  borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderRadius={borRadius}
                  borderColor={activeColor}
                  role='tab'
                >
                  Videos
                </Tab>
              </TabList>
              <TabPanels padding={0}>
                <TabPanel padding={0} role='tabpanel'>
                  <PhotosGallery user={user?.uid} data={data} />
                </TabPanel>
                <TabPanel padding={0} role='tabpanel'>
                  <AnimatedGallery user={user?.uid} data={data} />
                </TabPanel>
                <TabPanel padding={0} role='tabpanel'>
                  <VideoGallery user={user?.uid} data={data} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel padding={0}>
            <ProfileAccount data={data} />
          </TabPanel>
          <TabPanel padding={0}>
            <h2>Friends</h2>
          </TabPanel>
          <TabPanel padding={0}>
              <GroupUsers />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  ) : null
};