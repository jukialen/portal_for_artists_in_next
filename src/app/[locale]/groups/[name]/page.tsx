import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';
import Image from 'next/image';

import { HeadCom } from 'constants/HeadCom';
import { backUrl, supabaseStorageProfileUrl } from 'constants/links';
import { LangType, MemberType, PostsType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { getDate } from 'helpers/getDate';
import { getI18n, getScopedI18n } from 'locales/server';

import { UpdateGroupLogo } from 'components/functional/molecules/UpdateGroupLogo/UpdateGroupLogo';
import { NameGroupPage } from 'components/Views/NameGroupPage/NameGroupPage';

import styles from './page.module.css';
import { getLinkUrl } from '../../../../helpers/getLinkUrl';

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
    .select('groupId, description, logo, regulation, adminId, Users!adminId (pseudonym, profilePhoto)')
    .eq('name', name)
    .limit(1)
    .maybeSingle();

  if (!data || error) throw error;

  return {
    logo: await getLinkUrl('logos', `${backUrl}/group.svg`, data.logo),
    description: data?.description || '',
    regulation: data?.regulation || '',
    admin: myUser?.id === data?.adminId,
    groupId: data?.groupId || '',
    adminName: data.Users.pseudonym,
    adminPhoto: await getLinkUrl('profiles', `${backUrl}/group.svg`, data.Users.profilePhoto),
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

  const usersInGroup: MemberType[] = [{ usersGroupsId: '', pseudonym: '', profilePhoto: '', role: 'USER' }];

  try {
    const [usersRes, modsRes] = await Promise.all([
      supabase
        .from('UsersGroups')
        .select(`Users!userId (pseudonym, profilePhoto), Roles!roleId!inner (role)`)
        .eq('name', name)
        .eq('Roles.role', 'USER')
        .limit(30),

      supabase
        .from('UsersGroups')
        .select(`Users!userId (pseudonym, profilePhoto), Roles!roleId!inner (role)`)
        .eq('name', name)
        .eq('Roles.role', 'MODERATOR')
        .limit(30),
    ]);

    const combinedData = [...(usersRes.data || []), ...(modsRes.data || [])];

    if (combinedData.length === 0) return usersInGroup;

    for (const user of combinedData) {
      const { Users, Roles } = user;

      usersInGroup.push({
        usersGroupsId,
        pseudonym: Users.pseudonym!,
        profilePhoto: await getLinkUrl('profiles', `${backUrl}/friends.svg`, user.Users.profilePhoto!),
        role: Roles.role,
      });
    }

    return usersInGroup;
  } catch (e) {
    console.error(stringError);
    return usersInGroup;
  }
}
async function getFirstPosts(groupId: string, maxItems: number) {
  const postsArray: PostsType[] = [];

  const supabase = await createServer();

  const { data, error } = await supabase
    .from('Posts')
    .select('*, Users (pseudonym, profilePhoto), Roles!roleId (id)')
    .eq('groupId', groupId)
    .order('createdAt', { ascending: false })
    .limit(maxItems);

  if (!!error) return postsArray;

  for (const post of data!) {
    const { title, content, shared, commented, authorId, groupId, postId, createdAt, updatedAt, Users, Roles } = post;

    const { data: lData } = await supabase.from('Liked').select('userId').eq('postId', postId);

    const likedData = lData?.find((v: { userId: string }) => v.userId === authorId);

    postsArray.push({
      authorName: Users?.pseudonym!,
      authorProfilePhoto: supabaseStorageProfileUrl + '/' + Users?.profilePhoto!,
      liked: !!likedData,
      postId,
      title,
      content,
      likes: lData?.length || 0,
      shared,
      commented,
      authorId,
      groupId,
      roleId: Roles?.id!,
      date: await getDate(updatedAt || createdAt!),
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
  const membersGroups = (await members(joined.usersGroupsId, decodedName, tOther('unknownError'))).concat({
    usersGroupsId: joined.usersGroupsId,
    role: 'ADMIN',
    pseudonym: gData.adminName,
    profilePhoto: gData.adminPhoto,
  });

  const firstPosts = await getFirstPosts(joined.groupId || gData.groupId, 30);

  return (
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
  );
}
