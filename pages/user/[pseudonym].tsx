import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { ProfileUser } from 'components/atoms/ProfileUser/ProfileUser';

import styles from './index.module.scss';

export default function User() {
  const [uid, setUid] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';
  
  const { asPath } = useRouter();
  const split = asPath.split('/');
  const author = decodeURIComponent(split[split.length - 1]);
  
  const usersRef = collection(db, 'users');
  const uidRef = query(usersRef, where('pseudonym', '==', author));
  
  const downLoadUid = async () => {
    try {
      const querySnapshot = await getDocs(uidRef);
      querySnapshot.forEach((doc) => {
        setUid(doc.id);
        setDescription(doc.data().description)
      });
    } catch (e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
     !!author && downLoadUid();
  }, [author])
  
  return !loading ? (
    <>
      <HeadCom path={`/user/${author}`} content={`${author} site`} />
      
      <h2 className={styles.profile__user__title}>{author}</h2>
      
      <Tabs
        className={styles.tabs}
        size='sm'
        isLazy
        lazyBehavior='keepMounted'
        isFitted
        variant='unstyled'
      >
        <TabList
          className={styles.topTabList}
          role='tablist'
        >
          <div className={styles.profile__user__menu}>
            <div className={styles.content}>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role='tab'
              >
                {data?.Account?.aMenu?.gallery}
              </Tab>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role='tab'
              >
                {data?.Account?.aMenu?.profile}
              </Tab>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role='tab'
              >
                {data?.Account?.aMenu?.friends}
              </Tab>
              <Tab
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={borderColor}
                role='tab'
              >
                {data?.Account?.aMenu?.groups}
              </Tab>
            </div>
          </div>
        </TabList>
        
        <TabPanels className={styles.tabPanels}>
          <TabPanel
            className={styles.tabPanel}
            role='tabpanel'
          >
            <Tabs
              size='sm'
              isLazy
              lazyBehavior='keepMounted'
              isFitted
              variant='unstyled'
              className={styles.tabsForPanels}
            >
              <TabList
                className={styles.tabList}
                role='tablist'
              >
                <Tab
                  className={styles.tabForPanels}
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={borderColor}
                  role='tab'
                >
                  {data?.Aside?.photos}
                </Tab>
                <Tab
                  className={styles.tabForPanels}
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={borderColor}
                  role='tab'
                >
                  {data?.Aside?.animations}
                </Tab>
                <Tab
                  className={styles.tabForPanels}
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={borderColor}
                  role='tab'
                >
                  {data?.Aside?.videos}
                </Tab>
              </TabList>
              <TabPanels className={styles.tabPanels}>
                <TabPanel
                  className={styles.tabPanel}
                  role='tabpanel'
                >
                  <PhotosGallery user={uid} data={data} pseudonym={author} />
                </TabPanel>
                <TabPanel
                  className={styles.tabPanel}
                  role='tabpanel'
                >
                  <AnimatedGallery user={uid} data={data} pseudonym={author} />
                </TabPanel>
                <TabPanel
                  className={styles.tabPanel}
                  role='tabpanel'
                >
                  <VideoGallery user={uid} data={data} pseudonym={author} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel
            className={styles.tabPanel}
            role='tabpanel'
          >
            <ProfileUser
              data={data}
              pseudonym={author}
              fileUrl={uid!}
              description={description}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  ) : null;
};