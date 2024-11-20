import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cloudFrontUrl } from 'constants/links';
import { HeadCom } from 'constants/HeadCom';
import { Database } from 'types/database.types';
import { DateObjectType, LangType, MemberType, PostsType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';
import { getI18n, getScopedI18n } from 'locales/server';

import { UpdateGroupLogo } from 'components/molecules/UpdateGroupLogo/UpdateGroupLogo';
import { NameGroupPage } from 'components/Views/NameGroupPage/NameGroupPage';

import styles from './page.module.scss';
import { getDate } from '../../../helpers/getDate';
import { dateData } from '../../../helpers/dateData';

type JoinUser = {
  logo: string;
  description: string;
  regulation: string;
  join: boolean;
  favorite: boolean;
  favoriteLength: number;
  admin: boolean;
  groupId: string;
  roleId: string;
  usersGroupsId: string;
};

const supabase = createServerComponentClient<Database>({ cookies });

const emptyObject: JoinUser = {
  logo: '',
  description: '',
  regulation: '',
  join: false,
  favorite: false,
  favoriteLength: 0,
  admin: false,
  groupId: '',
  roleId: '',
  usersGroupsId: '',
};

async function joinedUser(name: string, stringError: string): Promise<JoinUser> {
  const myUser = await getUserData();

  const userGroupData = await supabase
    .from('UsersGroups')
    .select(
      `
      groupId, roleId, favorite, usersGroupsId,
      Groups ( logo, name, description, regulation, adminId),
      Roles (role)
     `,
    )
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
      const { groupId, usersGroupsId, roleId, favorite, Groups, Roles } = userGroupData.data;

      const joinedUser = !!userGroupData;

      return {
        logo: `https://${cloudFrontUrl}/${Groups?.logo}`,
        description: Groups?.description!,
        regulation: Groups?.regulation!,
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

async function getFirstPosts(groupId: string, maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  const postsArray: PostsType[] = [];

  const { data, error } = await supabase
    .from('Posts')
    .select('*, Users (pseudonym, profilePhoto), Roles (id)')
    .eq('groupId', groupId)
    .order('createdAt', { ascending: false })
    .limit(maxItems);

  if(!!error) {
    console.error(error);
    return;
  } else {
    for (const post of data!) {
      const { title, content, shared, commented, authorId, groupId, postId, createdAt, updatedAt, Users, Roles } = post;
      
      const { data: lData, count } = await supabase.from('Liked').select('id, userId').match({ postId, authorId });
      
      const indexCurrentUser = lData?.findIndex((v) => v.userId === authorId) || -1;
      
      postsArray.push({
        authorName: Users?.pseudonym!,
        authorProfilePhoto: `https://${cloudFrontUrl}/${Users?.profilePhoto!}`,
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
        date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        idLiked: !!lData && lData?.length > 0 ? lData[indexCurrentUser].id : '',
      });
    }
    return postsArray;

  }
}

export async function generateMetadata({ name }: { name: string }): Promise<Metadata> {
  return { ...HeadCom(`${name} group website`) };
}

export default async function Groups({ params: { locale, name } }: { params: { locale: LangType; name: string } }) {
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
    noRegulation: tOther('Regulations.noRegulation')
  };

  const userData = await getUserData();
  const dataDateObject = dateData();

  const selectedColor = '#FFD068';

  const joined = await joinedUser(name, tOther('unknownError'));
  const membersGroups = await members(joined.usersGroupsId, name, tOther('unknownError'));
  const firstPosts = await getFirstPosts(joined.groupId, 30, locale, await dataDateObject);

  return (
    <>
      <article className={styles.mainContainer}>
        <div className={styles.logo}>
          {joined.admin && (
            <UpdateGroupLogo logo={joined.logo} name={name} selectedColor={selectedColor} translated={translated} />
          )}
        </div>
        <h2 className={styles.nameGroup}>{name}</h2>
        <NameGroupPage
          name={name}
          userData={userData!}
          locale={locale}
          joined={joined}
          usersGroupsId={joined.usersGroupsId}
          members={membersGroups}
          translated={translated}
          firstPosts={firstPosts}
        />
      </article>
    </>
  );
}
