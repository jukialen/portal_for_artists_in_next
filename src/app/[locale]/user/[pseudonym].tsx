import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

<<<<<<<< Updated upstream:pages/user/[pseudonym].tsx
import { backUrl, cloudFrontUrl } from 'utilites/constants';
========
import { backUrl, cloudFrontUrl } from 'src/constants/links';
>>>>>>>> Stashed changes:source/app/[locale]/user/[pseudonym].tsx

import { FriendType, UserType } from 'src/types/global.types';

<<<<<<<< Updated upstream:pages/user/[pseudonym].tsx
import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useUserData } from 'hooks/useUserData';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { ProfileUser } from 'components/atoms/ProfileUser/ProfileUser';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { GroupUser } from 'components/organisms/GroupUser/GroupUser';
========
import { ProfileUser } from 'src/components/atoms/ProfileUser/ProfileUser';
import { FriendsList } from 'src/components/molecules/FriendsList/FriendsList';
import { AnimatedGallery } from 'src/components/organisms/AnimatedGallery/AnimatedGallery';
import { PhotosGallery } from 'src/components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'src/components/organisms/VideoGallery/VideoGallery';
import { GroupUser } from 'src/components/organisms/GroupUser/GroupUser';
>>>>>>>> Stashed changes:source/app/[locale]/user/[pseudonym].tsx

import styles from './index.module.scss';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
<<<<<<<< Updated upstream:pages/user/[pseudonym].tsx
========
import { Metadata, ResolvingMetadata } from 'next';
import { HeadCom } from 'src/constants/HeadCom';
import { getScopedI18n } from 'src/locales/server';
>>>>>>>> Stashed changes:source/app/[locale]/user/[pseudonym].tsx

export default function User() {
  const [idenFriend, setIdenFriend] = useState('');
  const [fid, setFid] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [addF, setAddF] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLength, setFavoriteLength] = useState(0);

  const data = useHookSWR();
  const { asPath, push } = useRouter();
  const { id } = useUserData();

  const pseudonym = decodeURIComponent(asPath.split('/')[2]);
  const contentList = [
    data?.Account?.aMenu?.gallery,
    data?.Account?.aMenu?.profile,
    data?.Account?.aMenu?.friends,
    data?.Account?.aMenu?.groups,
  ];
  const fileTabList = [data?.Aside?.photos, data?.Aside?.animations, data?.Aside?.videos];

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#82FF82';
  const borderColor = '#4F8DFF';

  const downLoadFid = async () => {
    try {
      const user: { data: UserType } = await axios.get(`${backUrl}/users/${pseudonym}`);

      setFid(user.data.id!);
      setDescription(user.data.description!);
      setFileUrl(`https://${cloudFrontUrl}/${user.data.profilePhoto}`);
    } catch (e) {
      console.error(e);
    }
  };

  const matchingFriend = async () => {
    const friends: { data: FriendType } = await axios.get(`${backUrl}/friends/all`, {
      params: {
        queryData: {
          where: {
            AND: [{ usernameId: id }, { friendId: fid }],
          },
        },
      },
    });

    if (!!friends.data) {
      setAddF(!addF);
      setFavorite(friends.data.favorite!);
      setIdenFriend(friends.data.id!);
    } else {
      console.error('No such friends!');
    }
  };

  const favFriendLength = async () => {
    const favs: { data: FriendType[] } = await axios.get(`${backUrl}/friends/all`, {
      params: {
        queryData: {
          where: {
            AND: [{ usernameId: id }, { favorite: true }],
          },
        },
      },
    });

    setFavoriteLength(favs.data.length);
  };

  const addToFriends = async () => {
    try {
      if (addF) {
        await axios.delete(`${backUrl}/friends/${idenFriend}`);

        setFavorite(false);
        setAddF(!addF);
      } else {
        await axios.post(`${backUrl}/friends`, {
          username: id,
          firned: fid,
        });
        setAddF(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addToFavorites = async () => {
    try {
      await axios.patch(`${backUrl}/friends/${idenFriend}`, { favorite: !favorite });
      setFavorite(!favorite);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    id === fid && push(`/account/${pseudonym}`);
  }, [id, fid]);

  useEffect(() => {
    !!pseudonym && downLoadFid();
  }, [pseudonym]);

  useEffect(() => {
    !!id && matchingFriend();
  }, [id]);

  useEffect(() => {
    favFriendLength();
  }, [id]);

  if (useCurrentUser('/signin')) {
    return null;
  }

  return (
    <>
      <HeadCom path={`/user/${pseudonym}`} content={`${pseudonym} site`} />

      <h2 className={styles.profile__user__title}>{pseudonym}</h2>

      <div className={styles.friendsButtons}>
        {id === fid ? null : (
          <button className={addF ? styles.addedButton : styles.addButton} onClick={addToFriends}>
            {addF ? <CheckIcon boxSize="1rem" /> : <SmallAddIcon boxSize="1.5rem" />}
            <p>{addF ? data?.Friends?.added : data?.Friends?.add}</p>
          </button>
        )}

        {id === fid ? null : !addF ? null : (
          <div>
            <button
              className={addF && favorite ? styles.addedButton : styles.addButton}
              onClick={addToFavorites}
              disabled={favoriteLength === 5}>
              {favorite && favoriteLength !== 5 ? <CheckIcon boxSize="1rem" /> : <SmallAddIcon boxSize="1.5rem" />}
              <p>{addF && favorite ? data?.Friends?.addedFav : data?.Friends?.addFav}</p>
            </button>
            {!favorite && (
              <p>{!addF ? '' : !favorite && favoriteLength < 5 ? data?.Friends?.max : data?.Friends?.addedMax}</p>
            )}
          </div>
        )}
      </div>

      {id === fid ? null : <Divider orientation="horizontal" width="95%" />}

      <Tabs className={styles.tabs} size="sm" isLazy lazyBehavior="keepMounted" isFitted variant="unstyled">
        <TabList className={styles.topTabList} role="tablist">
          <div className={styles.profile__user__menu}>
            <div className={styles.content}>
              {contentList.map((content, index) => (
                <Tab
                  key={index}
                  _selected={{ borderColor: selectedColor }}
                  _hover={{ borderColor: hoverColor }}
                  _active={{ borderColor: activeColor }}
                  borderColor={borderColor}
                  role="tab">
                  {content}
                </Tab>
              ))}
            </div>
          </div>
        </TabList>

        <TabPanels className={styles.tabPanels}>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <Tabs
              size="sm"
              isLazy
              lazyBehavior="keepMounted"
              isFitted
              variant="unstyled"
              className={styles.tabsForPanels}>
              <TabList className={styles.tabList} role="tablist">
                {fileTabList.map((tab, index) => (
                  <Tab
                    key={index}
                    className={styles.tabForPanels}
                    _selected={{ borderColor: selectedColor }}
                    _hover={{ borderColor: hoverColor }}
                    _active={{ borderColor: activeColor }}
                    borderColor={borderColor}
                    role="tab">
                    {tab}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className={styles.tabPanels}>
                <TabPanel className={styles.tabPanel} role="tabpanel">
                  <PhotosGallery id={id} data={data} pseudonym={pseudonym} />
                </TabPanel>
                <TabPanel className={styles.tabPanel} role="tabpanel">
                  <AnimatedGallery id={id} data={data} pseudonym={pseudonym!} />
                </TabPanel>
                <TabPanel className={styles.tabPanel} role="tabpanel">
                  <VideoGallery id={id} data={data} pseudonym={pseudonym!} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <ProfileUser data={data} pseudonym={pseudonym} fileUrl={fileUrl} description={description} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <FriendsList id={fid} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <GroupUser id={fid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
