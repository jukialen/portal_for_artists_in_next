import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';
import Image from 'next/image';

import { HeadCom } from 'constants/HeadCom';
import { backUrl } from 'constants/links';
import { LangType, MemberType, PostsType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { getDate } from 'helpers/getDate';
import { getI18n, getScopedI18n } from 'locales/server';

import { UpdateGroupLogo } from 'components/functional/molecules/UpdateGroupLogo/UpdateGroupLogo';
import { NameGroupPage } from 'components/Views/NameGroupPage/NameGroupPage';

import styles from './page.module.css';

type JoinUser = {
  join: boolean;
  favorite: boolean;
  favoriteLength: number;
  admin: boolean;
  groupId: string;
  roleId: string;
  usersGroupsId: string;
};

type PropsType = {
  params: Promise<{
    locale: LangType;
    name: string;
  }>;
};

export async function generateMetadata({ params }: PropsType): Promise<Metadata> {
  const { name } = await params;
  return { ...HeadCom(`${name} group website`) };
}

const emptyObject: JoinUser = {
  join: false,
  favorite: false,
  favoriteLength: 0,
  admin: false,
  groupId: '',
  roleId: '',
  usersGroupsId: '',
};

async function groupData(name: string) {
  const supabase = await createServer();

  const myUser = await getUserData();

  const { data, error } = await supabase
    .from('Groups')
    .select('groupId, description, logo, regulation, adminId')
    .eq('name', name)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const url = data?.logo
    ? (await supabase.storage.from('logos').createSignedUrl(data?.logo, 3600, { download: false })).data?.signedUrl
    : `${backUrl}/group.svg`;

  return {
    logo: url,
    description: data?.description || '',
    regulation: data?.regulation || '',
    admin: myUser?.id === data?.adminId,
    groupId: data?.groupId || '',
  };
}

async function joinedUser(name: string, stringError: string) {
  const supabase = await createServer();

  const myUser = await getUserData();

  const userGroupData = await supabase
    .from('UsersGroups')
    .select(`groupId, roleId, favorite, usersGroupsId, Roles!roleId (role)`)
    .eq('name', name)
    .eq('userId', myUser?.id!)
    .limit(1)
    .single();

  const favoriteLengthGroups = await supabase
    .from('UsersGroups')
    .select('favorite')
    .eq('userId', myUser?.id!)
    .eq('favorite', true);

  try {
    if (!!userGroupData.data) {
      const { groupId, usersGroupsId, roleId, favorite, Roles } = userGroupData.data;

      const joinedUser = !!userGroupData;

      return {
        join: joinedUser,
        favorite,
        favoriteLength: favoriteLengthGroups.count!,
        admin: joinedUser ? Roles!.role === 'ADMIN' : false,
        groupId: joinedUser ? groupId! : '',
        roleId: joinedUser ? roleId : '',
        usersGroupsId: joinedUser ? usersGroupsId : '',
      };
    } else {
      return emptyObject;
    }
  } catch (e) {
    console.error(stringError);

    return emptyObject;
  }
}
async function members(usersGroupsId: string, name: string, stringError: string): Promise<MemberType[]> {
  const supabase = await createServer();

  const usersGroupData = await supabase
    .from('Groups')
    .select(
      `
      Users (pseudonym, profilePhoto),
      Roles (role)
     `,
    )
    .eq('name', name)
    .limit(30);

  const usersInGroup: MemberType[] = [];

  try {
    if (!!usersGroupData.data) {
      for (const user of usersGroupData.data) {
        const { Users, Roles } = user;

        usersInGroup.push({
          usersGroupsId,
          pseudonym: Users[0].pseudonym!,
          profilePhoto: Users[0].profilePhoto!,
          role: Roles[0].role,
        });
      }

      return usersInGroup;
    } else {
      return [{ usersGroupsId, pseudonym: '', profilePhoto: '', role: 'USER' }];
    }
  } catch (e) {
    console.error(stringError);

    return [{ usersGroupsId, pseudonym: '', profilePhoto: '', role: 'USER' }];
  }
}
async function getFirstPosts(groupId: string, maxItems: number) {
  const postsArray: PostsType[] = [];

  const supabase = await createServer();

  const { data, error } = await supabase
    .from('Posts')
    .select('*, Users (pseudonym, profilePhoto), Roles (id)')
    .eq('groupId', groupId)
    .order('createdAt', { ascending: false })
    .limit(maxItems);

  if (!!error) {
    // console.error(error);
    return postsArray;
  }

  for (const post of data!) {
    const { title, content, shared, commented, authorId, groupId, postId, createdAt, updatedAt, Users, Roles } = post;

    const { data: lData, count } = await supabase.from('Liked').select('id, userId').match({ postId, authorId });

    const indexCurrentUser = lData?.findIndex((v) => v.userId === authorId) || -1;

    postsArray.push({
      authorName: Users?.pseudonym!,
      authorProfilePhoto: Users?.profilePhoto!,
      liked: indexCurrentUser >= 0,
      postId,
      title,
      content,
      likes: count || 0,
      shared,
      commented,
      authorId,
      groupId,
      roleId: Roles?.id!,
      date: await getDate(updatedAt || createdAt!),
      idLiked: !!lData && lData?.length > 0 ? lData[indexCurrentUser].id : '',
    });
  }
  return postsArray;
}

export default async function Groups({ params }: PropsType) {
  const { locale, name } = await params;
  setStaticParamsLocale(locale);

  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tOther = await getI18n();

  const translated = {
    updateLogo: {
      upload: tAnotherForm('uploadFile'),
      notUpload: tAnotherForm('notUploadFile'),
      validateRequired: tOther('NavForm.validateRequired'),
      cancelButton: tOther('DeletionFile.cancelButton'),
      submit: tOther('Description.submit'),
    },
    joinedUser: {
      join: tOther('Groups.join'),
      joined: tOther('Groups.joined'),
      addedToFav: tOther('Groups.favorite.addedToFav'),
      addToFav: tOther('Groups.favorite.addedToFav'),
      addToFavorite: tOther('Groups.favorite.addToFavorite'),
      maxFav: tOther('Groups.favorite.maxFav'),
      maximumAchieved: tOther('Groups.favorite.maximumAchieved'),
    },
    groupSections: {
      general: tOther('Account.aMenu.general'),
      members: tOther('Groups.menu.members'),
      description: tAnotherForm('description'),
      noPermission: tOther('Groups.noPermission'),
      deleteGroup: tOther('Groups.deleteGroup'),
    },
    members: {
      admin: tOther('Members.admin'),
      moderators: tOther('Members.moderators'),
      modsAria: tOther('Members.modsAria'),
      noMods: tOther('Members.noMods'),
      anotherMembers: tOther('Members.anotherMembers'),
      addModAria: tOther('Members.addModAria'),
      noMembers: tOther('Members.noMembers'),
    },
    posts: {
      add: tOther('Groups.addingPost.add'),
      addTitPlaceholder: tOther('Groups.addingPost.addTitAria'),
      addTitAria: tOther('Groups.addingPost.addTitAria'),
      addDescription: tOther('Groups.addingPost.addDescription'),
      addDesAria: tOther('Groups.addingPost.addDesAria'),
    },
    error: tOther('error'),
    noRegulation: tOther('Regulations.noRegulation'),
  };

  const userData = await getUserData();
  const decodedName = decodeURIComponent(name);

  const gData = await groupData(decodedName);
  const joined = await joinedUser(decodedName, tOther('unknownError'));
  const membersGroups = await members(joined.usersGroupsId, decodedName, tOther('unknownError'));
  const firstPosts = await getFirstPosts(joined.groupId, 30);

  return (
    <>
      <article className={styles.mainContainer}>
        <div className={styles.logo}>
          <Image src={gData.logo} fill priority alt={`${name} logo`} />
          {gData.admin && <UpdateGroupLogo logo={gData.logo} name={name} translated={translated} />}
        </div>

        <NameGroupPage
          name={decodedName}
          userData={userData!}
          joined={{ ...joined, ...gData }}
          usersGroupsId={joined.usersGroupsId}
          members={membersGroups}
          translated={translated}
          firstPosts={firstPosts}
        />
      </article>
    </>
  );
}
