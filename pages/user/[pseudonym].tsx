import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { ProfileUser } from 'components/atoms/ProfileUser/ProfileUser';

import styles from './index.module.scss';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

export default function User() {
  const [uid, setUid] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  const borRadius = '0 1rem/3rem';
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#4F8DFF';
  const fontMenu = '1rem';
  
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
     downLoadUid();
  }, [uidRef])
  
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={`/user/${author}`} content={`${author} site`} />
      
      <h2 className={styles.profile__user__title}>{author}</h2>
      
      <Tabs
        size='sm'
        align='center'
        justifySelf='center'
        maxW='100vw'
        m='0 auto'
        isLazy
        lazyBehavior='keepMounted'
        isFitted
        variant='unstyled'
      >
        <TabList padding='0 0 5rem'>
          <div className={styles.profile__user__menu}>
            <div className={styles.content}>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                {data?.Account?.aMenu?.gallery}
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                {data?.Account?.aMenu?.profile}
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
                borderColor={activeColor}
                borderRadius={borRadius}
              >
                Friends
              </Tab>
              <Tab
                fontSize={fontMenu}
                _selected={{ borderColor: selectedColor }}
                _hover={{ borderColor: hoverColor }}
                _active={{ borderColor: activeColor }}
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
                  _active={{ borderColor: activeColor }}
                  borderColor={activeColor}
                  borderRadius={borRadius}
                  role='tab'
                >
                  Photos
                </Tab>
                <Tab
                  h='2rem'
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
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
                  _hover={{ borderColor: hoverColor }}
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
                  <PhotosGallery user={uid} data={data} pseudonym={author} />
                </TabPanel>
                <TabPanel padding={0} role='tabpanel'>
                  <AnimatedGallery user={uid} data={data} pseudonym={author} />
                </TabPanel>
                <TabPanel padding={0} role='tabpanel'>
                  <VideoGallery user={uid} data={data} pseudonym={author} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel padding={0}>
            <ProfileUser
              data={data}
              pseudonym={author}
              fileUrl={uid!}
              description={description}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>
  ) : null;
};