import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import axios from 'axios';
import { Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { backUrl, cloudFrontUrl } from 'constants/links';
import { HeadCom } from 'constants/HeadCom';

import { getI18n, getScopedI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';

import { FriendType, LangType, UserType } from 'types/global.types';

import { ProfileUser } from 'components/atoms/ProfileUser/ProfileUser';
import { FriendsList } from 'components/molecules/FriendsList/FriendsList';
import { AnimatedGallery } from 'components/organisms/AnimatedGallery/AnimatedGallery';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { GroupUser } from 'components/organisms/GroupUser/GroupUser';

import styles from './page.module.scss';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';

export async function generateMetadata({
  params: { pseudonym },
}: {
  params: { pseudonym: string };
}): Promise<Metadata> {
  return { ...HeadCom(`${pseudonym} site`) };
}
export default async function User({
  params: { locale, pseudonym },
}: {
  params: { locale: LangType; pseudonym: string };
}) {
  setStaticParamsLocale(locale);

  const dataDateObject = await dateData();
  const tAccountaMenu = await getScopedI18n('Account.aMenu');
  const tAside = await getScopedI18n('Aside');
  const t = await getI18n();

  // const pseudonym = decodeURIComponent(pathname.split('/')[2]);
  const tFriends = {
    friends: t('Nav.friends'),
    noFriends: t('Friends.noFriends'),
  };

  const tGroupsUser = {
    adminTitle: t('groupsUser.adminTitle'),
    modsTitle: t('groupsUser.modsTitle'),
    usersTitle: t('groupsUser.usersTitle'),
    accountAdminTitle: t('Account.groups.adminTitle'),
    accountNoMods: t('Account.groups.noMods'),
    accountNoUsers: t('Account.groups.noUsers'),
  };

  const tGallery = {
    userPhotosTitle: t('Account.gallery.userPhotosTitle'),
    userAnimationsTitle: t('Account.gallery.userAnimationsTitle'),
    userVideosTitle: t('Account.gallery.userVideosTitle'),
    noPhotos: t('ZeroFiles.photos'),
    noAnimations: t('ZeroFiles.animations'),
    noVideos: t('ZeroFiles.videos'),
  };

  const contentList = [
    tAccountaMenu('gallery'),
    tAccountaMenu('profile'),
    tAccountaMenu('friends'),
    tAccountaMenu('groups'),
  ];
  const fileTabList = [tAside('photos'), tAside('animations'), tAside('videos')];

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

  return (
    <>
      <h2 className={styles.profile__user__title}>{pseudonym}</h2>

      <div className={styles.friendsButtons}>
        {id === fid ? null : (
          <button className={addF ? styles.addedButton : styles.addButton} onClick={addToFriends}>
            {addF ? <CheckIcon boxSize="1rem" /> : <SmallAddIcon boxSize="1.5rem" />}
            <p>{addF ? language?.Friends?.added : language?.Friends?.add}</p>
          </button>
        )}

        {id === fid ? null : !addF ? null : (
          <div>
            <button
              className={addF && favorite ? styles.addedButton : styles.addButton}
              onClick={addToFavorites}
              disabled={favoriteLength === 5}>
              {favorite && favoriteLength !== 5 ? <CheckIcon boxSize="1rem" /> : <SmallAddIcon boxSize="1.5rem" />}
              <p>{addF && favorite ? language?.Friends?.addedFav : language?.Friends?.addFav}</p>
            </button>
            {!favorite && (
              <p>
                {!addF ? '' : !favorite && favoriteLength < 5 ? language?.Friends?.max : language?.Friends?.addedMax}
              </p>
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
                  <PhotosGallery
                    id={id}
                    tGallery={tGallery}
                    pseudonym={pseudonym}
                    dataDateObject={dataDateObject}
                    locale={locale}
                    plan={plan}
                  />
                </TabPanel>
                <TabPanel className={styles.tabPanel} role="tabpanel">
                  <AnimatedGallery
                    id={id}
                    tGallery={tGallery}
                    pseudonym={pseudonym!}
                    dataDateObject={dataDateObject}
                    locale={locale}
                    plan={plan}
                  />
                </TabPanel>
                <TabPanel className={styles.tabPanel} role="tabpanel">
                  <VideoGallery
                    id={id}
                    tGallery={tGallery}
                    pseudonym={pseudonym!}
                    plan={plan}
                    dataDateObject={dataDateObject}
                    locale={locale}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <ProfileUser language={t} pseudonym={pseudonym} fileUrl={fileUrl} description={description} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <FriendsList id={fid} tFriends={tFriends} />
          </TabPanel>
          <TabPanel className={styles.tabPanel} role="tabpanel">
            <GroupUser id={fid} tGroupsUser={tGroupsUser} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
