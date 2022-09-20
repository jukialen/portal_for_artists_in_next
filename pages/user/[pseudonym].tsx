import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, getDocs, query as qFire, setDoc, where } from 'firebase/firestore';
import { Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { delFriends, friends, user, usersRef } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { ProfileUser } from 'components/atoms/ProfileUser/ProfileUser';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { GroupUser } from 'components/organisms/GroupUser/GroupUser';

import styles from './index.module.scss';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';

export default function User() {
  const [uid, setUid] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const [addF, setAddF] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLength, setFavoriteLength] = useState(0);
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const { query, push } = useRouter();
  const { pseudonym } = query;
  const currentUser = auth.currentUser?.uid;
  
  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';
  
  const downLoadUid = async () => {
    try {
      const uidRef = qFire(usersRef, where('pseudonym', '==', pseudonym));
      
      const querySnapshot = await getDocs(uidRef);
      querySnapshot.forEach((doc) => {
        setUid(doc.id);
        setDescription(doc.data().description);
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  const downloadFriends = async () => {
    const docRef = qFire(friends(currentUser!), where('friend', '==', doc(db, `users/${uid}`)));
  
    const querySnapshot = await getDocs(docRef);
    querySnapshot.forEach((document) => !!document && setAddF(!addF));
  
    const docSnap = await getDoc(user(currentUser!));
    
    if (docSnap.exists()) {
      docSnap.data().favoriteFriends.forEach((favoriteFriend: string) => {
        favoriteFriend === uid && setFavorite(!favorite);
        favoriteFriend === uid && setFavoriteLength(favoriteFriend.length);
      });
      setFavoriteLength(docSnap.data().favoriteFriends.length);
    } else {
      console.error('No such favorite friends!');
    }
  };
  
  useEffect(() => { !!pseudonym && downLoadUid() }, [pseudonym]);
  
  useEffect(() => { !!uid && downloadFriends() }, [uid]);
  
  const addToFriends = async () => {
    try {
      if (addF) {
        const docRef = qFire(friends(currentUser!), where('friend', '==', doc(db, `users/${uid}`)));

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((document) => {
          deleteDoc(delFriends(currentUser!, document.id));
        });

        await setDoc(user(currentUser!), { favoriteFriends: arrayRemove(uid) }, { merge: true });
        setAddF(false);
      } else {
        await setDoc(doc(friends(currentUser!)), { friend: doc(db, `users/${uid}`) });
        setAddF(true);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const addToFavorites = async () => {
    try {
      if (favorite) {
        await setDoc(user(currentUser!), {
          favoriteFriends: arrayRemove(uid)
        }, { merge: true });
      } else {
        await setDoc(user(currentUser!), {
          favoriteFriends: arrayUnion(uid)
        }, { merge: true });
      }
      setFavorite(!favorite);
      
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    currentUser === uid && push(`/account/${pseudonym}`);
  }, [currentUser, uid])
  
  if (loading) { return null };
  
  return <>
    <HeadCom path={`/user/${pseudonym}`} content={`${pseudonym} site`} />
    
    <h2 className={styles.profile__user__title}>{pseudonym}</h2>
    
    <div className={styles.friendsButtons}>
      {currentUser === uid ? null :
        <button
          className={addF ? styles.addedButton : styles.addButton}
          onClick={addToFriends}
        >
          {addF ? <CheckIcon boxSize='1rem' /> : <SmallAddIcon boxSize='1.5rem' />}
          <p>{addF ? data?.Friends?.added : data?.Friends?.add}</p>
        </button>}
      
      {currentUser === uid ? null : !addF ? null :
        <div>
          <button
            className={addF && favorite ? styles.addedButton : styles.addButton}
            onClick={addToFavorites}
            disabled={favoriteLength === 5}
          >
            {favorite && favoriteLength !== 5 ? <CheckIcon boxSize='1rem' /> : <SmallAddIcon boxSize='1.5rem' />}
            <p>{addF && favorite ? data?.Friends?.addedFav : data?.Friends?.addFav}</p>
          </button>
          {!favorite && <p>
            {!addF ? '' : !favorite && favoriteLength < 5 ? data?.Friends?.max : data?.Friends?.addedMax}
          </p>}
        </div>}
    </div>
  
    {currentUser === uid ? null : <Divider orientation='horizontal' width='95%' />}
    
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
                <PhotosGallery user={uid} data={data} pseudonym={pseudonym!} />
              </TabPanel>
              <TabPanel
                  className={styles.tabPanel}
                  role='tabpanel'
                >
                  <AnimatedGallery user={uid} data={data} pseudonym={pseudonym!} />
                </TabPanel>
                <TabPanel
                  className={styles.tabPanel}
                  role='tabpanel'
                >
                  <VideoGallery user={uid} data={data} pseudonym={pseudonym!} />
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
              pseudonym={pseudonym}
              fileUrl={uid!}
              description={description}
            />
          </TabPanel>
          <TabPanel
            className={styles.tabPanel}
            role='tabpanel'
          >
            <FriendsList uid={uid!} />
          </TabPanel>
          <TabPanel
            className={styles.tabPanel}
            role='tabpanel'
          >
            <GroupUser uidUser={uid!} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
};