import { ReactNode } from 'react';
import { Viewport } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import { getScopedI18n, getStaticParams } from 'locales/server';
import { setStaticParamsLocale } from 'next-international/server';

import { backUrl, GTM_ID } from 'constants/links';
import { FriendsListArrayType, GroupsType, LangType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { createServer } from 'utils/supabase/clientSSR';

import { Categories } from 'components/functional/atoms/Categories/Categories';
import { Friends } from 'components/functional/atoms/Friends/Friends';
import { Groups } from 'components/functional/atoms/Groups/Groups';
import { SWStart } from 'components/functional/atoms/SWStart';
import { Header } from 'components/ui/organisms/Header/Header';
import { UserHeader } from 'components/functional/organisms/UserHeader/UserHeader';

import { ModeProvider } from 'providers/ModeProvider';

import styles from './Layout.module.css';
import 'styles/reset.css';
import 'styles/global.css';
import 'styles/_variables.css';
import { RiArrowDownSLine } from 'react-icons/ri';


type ChildrenType = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(0, 0%, 97%, 0.9)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsla(0, 0%, 97%, 0.1)' },
  ],
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return getStaticParams() as { locale: LangType }[];
}

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

export default async function RootLayout({ children, params }: ChildrenType) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const lang = locale as LangType;
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
          <Categories />
        </details>

        <Groups groupsAsideList={groupsAsideList!} />
        <Friends friendsAsideList={friendsAsideList!} />
      </div>
    )
  };

  const userMenuComponents = {
    userHeader: <UserHeader />,
    header: <Header />,
    aside: <>
      <aside className={styles.aside}>
        <AsideBody />
      </aside>
      <button popoverTarget="mobile-drawer" className={styles.aside__right}>
        <RiArrowDownSLine />
      </button>
      <div id="mobile-drawer" popover="auto" className={styles.drawer}>
        <div className={styles.drawerBody}>
          <div className={styles.blur} />
          <AsideBody />
        </div>

        <button popoverTarget="mobile-drawer" popoverTargetAction="hide" className={styles.drawer__right}>
          <RiArrowDownSLine />
        </button>
      </div>
    </>
  };

  const user = await getUserData();

  return (
    <html lang={locale} suppressHydrationWarning>
      {!!GTM_ID && typeof window !== 'undefined' && <GoogleTagManager gtmId={GTM_ID} />}

      <body>
        <SWStart locale={lang}>
          <ModeProvider>
            {!!user ? userMenuComponents.userHeader : userMenuComponents.header}

            <div className={!!user ? styles.container__user : styles.container}>
              {!!user && userMenuComponents.aside}

              <main className={!!user ? styles.user__container : styles.main__container}>{children}</main>
            </div>
          </ModeProvider>
        </SWStart>
      </body>
    </html>
  );
}

