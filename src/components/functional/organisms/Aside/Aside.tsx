import { createServer } from 'utils/supabase/clientSSR';

import { backUrl } from 'constants/links';
import { FriendsListArrayType, GroupsType } from 'types/global.types';

import { getScopedI18n } from 'locales/server';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { getUserData } from 'helpers/getUserData';

import { RiArrowDownSLine } from 'react-icons/ri';
import { Categories } from 'components/functional/atoms/Categories/Categories';
import { Groups } from 'components/functional/atoms/Groups/Groups';
import { Friends } from 'components/functional/atoms/Friends/Friends';

import styles from './Aside.module.css';

async function getFriendsList(userId: string, maxItems: number) {
  const favoriteFriendArray: FriendsListArrayType[] = [];

  const supabase = await createServer();

  const { data, error } = await supabase
    .from('Friends')
    .select('Users!friendId (pseudonym, profilePhoto)')
    .eq('usernameId', userId)
    .eq('favorite', true)
    .order('createdAt', { ascending: true })
    .limit(maxItems);

  if (!data || !!error) return favoriteFriendArray;

  for (const { Users } of data) {
    favoriteFriendArray.push({
      pseudonym: Users?.pseudonym!,
      profilePhoto: await getLinkUrl('profiles', `${backUrl}/friends.svg`, Users?.profilePhoto),
      favorites: data.length,
    });
  }

  return favoriteFriendArray;
}

async function getGroupsList(id: string, maxItems: number) {
  const groupList: GroupsType[] = [];

  const supabase = await createServer();
  const { data, error } = await supabase
    .from('UsersGroups')
    .select('Groups!name (description, logo, name)')
    .eq('userId', id)
    .eq('favorite', true)
    .order('createdAt', { ascending: true })
    .limit(maxItems);

  try {
    if (!data || !!error) return groupList;

    for (const { Groups } of data!) {
      groupList.push({
        name: Groups.name,
        description: Groups.description!,
        logo: await getLinkUrl('logos', `${backUrl}/group.svg`, Groups.logo),
      });
    }

    return groupList;
  } catch (e) {
    console.error(e);
  }
}

export async function Aside() {
  const tAside = await getScopedI18n('Aside');
  const userData = await getUserData();
  const maxItems = 5;

  const friendsAsideList = await getFriendsList(userData?.id!, maxItems);
  const groupsAsideList = await getGroupsList(userData?.id!, maxItems);

  function AsideBody() {
    return (
      <div className={styles.rolling}>
        <details className={styles.categoriesDetails}>
          <summary className={styles.h3}>
            <h3>{tAside('category')}</h3>
            <RiArrowDownSLine className={styles.categoryArrow} />
          </summary>
          <div className={styles.container}>
            <Categories />
          </div>
        </details>

        <Groups groupsAsideList={groupsAsideList!} />
        <Friends friendsAsideList={friendsAsideList!} />
      </div>
    );
  }

  return (
    <>
      <aside className={styles.aside}>
        <AsideBody />
      </aside>
      <button popoverTarget="mobile-drawer" className={styles.aside__right}>
        <RiArrowDownSLine />
      </button>
      {/* MOBILE DRAWER - używa Popover API */}
      <div id="mobile-drawer" popover="auto" className={styles.drawer}>
        <div className={styles.drawerBody}>
          <div className={styles.blur}></div>
          <AsideBody />
        </div>

        <button popoverTarget="mobile-drawer" popoverTargetAction="hide" className={styles.drawer__right}>
          <RiArrowDownSLine />
        </button>
      </div>
    </>
  );
}
