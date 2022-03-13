import { auth } from '../../firebase';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useUserData } from 'hooks/useUserData';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';

import styles from './index.module.scss';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { DeleteAccount } from '../../components/atoms/DeleteAccount/DeleteAccount';

export default function Account() {
  const user = auth.currentUser;
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const { pseudonym } = useUserData();
  
  const marginTabs = '2rem';
  const backColor = '#FFD068';
  const borRadius = '0 1rem/3rem';
  
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={`/account/${pseudonym || user?.displayName}`} content='Account portal site.' />
      
      <h2 className={styles.account__h2}>{data?.Nav?.account}</h2>
      
      <AccountMenu data={data} />
      
      <AccountData data={data} />
      
      <FilesUpload />
      <Tabs
        size='sm'
        align='center'
        justifySelf='center'
        maxW='100vw'
        m='4rem auto'
        gap='2rem'
        isLazy
        isFitted
        variant='enclosed-colored'
      >
        <TabList
          width='51%'
          flexWrap='wrap'
          gap='2rem'
          m='auto'
          border='none'
          role='tablist'
        >
          <Tab
            h='2rem'
            borderRadius={borRadius}
            role='tab'
          >
            Photos
          </Tab>
          <Tab
            h='2rem'
            borderRadius={borRadius}
            role='tab'
          >
            Animations
          </Tab>
          <Tab
            h='2rem'
            borderRadius={borRadius}
            role='tab'
          >
            Videos
          </Tab>
        </TabList>
        <TabPanels padding={0}>
          <TabPanel role='tabpanel'>
            <PhotosGallery data={data} />
          </TabPanel>
          <TabPanel role='tabpanel'>
            <AnimatedGallery data={data} />
          </TabPanel>
          <TabPanel role='tabpanel'>
            <VideoGallery data={data} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <ProfileAccount data={data} />
      
      <DeleteAccount />
    </section>
  ) : null
};