'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs } from '@ark-ui/react/tabs';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';

import { createClient } from 'utils/supabase/clientCSR';
import { JoinUser, MemberType, nameGroupTranslatedType, PostsType, UserType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { Members } from 'components/functional/atoms/Members/Members';
import { AddingPost } from 'components/functional/molecules/AddingPost/AddingPost';
import { DescriptionSection } from 'components/functional/molecules/DescriptionSection/DescriptionSection';
import { Posts } from 'components/functional/organisms/Posts/Posts';
import { Separator } from 'components/ui/atoms/Separator/Separator';

import styles from './NameGroupPage.module.css';

export const NameGroupPage = ({
  name,
  userData,
  joined,
  members,
  usersGroupsId,
  translated,
  firstPosts,
}: {
  name: string;
  userData: UserType;
  joined: JoinUser;
  members: MemberType[];
  usersGroupsId: string;
  translated: nameGroupTranslatedType;
  firstPosts: PostsType[];
}) => {
  const [join, setJoin] = useState(joined.join);
  const [favorite, setFavorite] = useState(joined.favorite);
  const [favoriteLength, setFavoriteLength] = useState(joined.favoriteLength);
  const [deleteGroupInfo, setDeleteGroupInfo] = useState('');
  const [roleId, setRoleId] = useState(joined.roleId);

  const { description, regulation: rawReg, groupId } = joined;
  const regulation = rawReg !== '' ? rawReg.split('\n').join('\n') : translated?.noRegulation!;
  const supabase = createClient();
  const { push } = useRouter();

  const contentList = [
    translated.groupSections?.general,
    translated.groupSections?.members,
    translated.groupSections?.description,
  ];

  const toggleToGroup = async () => {
    try {
      if (!join) {
        const { data } = await supabase
          .from('Roles')
          .insert([{ groupId, userId: userData?.id!, role: 'USER' }])
          .select('id')
          .single();
        if (data) {
          setRoleId(data.id);
          await supabase.from('UsersGroups').insert([{ name, groupId, userId: userData?.id!, roleId: data.id }]);
        }
      } else {
        const { data } = await supabase
          .from('UsersGroups')
          .delete()
          .eq('usersGroupsId', usersGroupsId)
          .eq('userId', userData?.id!)
          .select('roleId')
          .single();
        if (data) await supabase.from('Roles').delete().eq('id', data.roleId);
      }
      setJoin(!join);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleToFavorites = async () => {
    try {
      if (favorite) {
        const { error } = await supabase
          .from('UsersGroups')
          .update({ favorite: false })
          .eq('usersGroupsId', usersGroupsId);
        if (!error) setFavoriteLength((prev) => prev - 1);
      } else {
        const { count } = await supabase
          .from('UsersGroups')
          .select('*', { count: 'exact', head: true })
          .eq('userId', userData?.id!);
        if (count === null || count < 5) {
          await supabase.from('UsersGroups').update({ favorite: true }).eq('usersGroupsId', usersGroupsId);
          setFavoriteLength((prev) => (prev ?? 0) + 1);
        } else setFavoriteLength(5);
      }
      setFavorite(!favorite);
    } catch (e) {
      console.error(e);
    }
  };

  const removeGroup = async () => {
    try {
      const { error } = await supabase.from('Groups').delete().eq('groupId', groupId).eq('name', name);
      if (error) throw error;
      push('/app');
    } catch (e) {
      console.error(e);
      setDeleteGroupInfo(translated.error!);
    }
  };

  return (
    <>
      <div className={styles.nameGroupLogoAndData}>
        <h2 className={styles.nameGroup}>{name}</h2>
        {joined.admin ? (
          <div className={styles.adminButtons}>
            <button className={styles.button} onClick={removeGroup}>
              {translated.groupSections?.deleteGroup}
            </button>
            {!!deleteGroupInfo && <Alerts valueFields={deleteGroupInfo} />}
          </div>
        ) : join ? (
          <button className={styles.joined} popoverTarget="join_popover" popoverTargetAction="toggle">
            {join ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
            {join ? translated.joinedUser?.joined : translated.joinedUser?.join}
          </button>
        ) : (
          <button onClick={toggleToGroup} className={styles.joined}>
            {join ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
            {join ? translated.joinedUser?.joined : translated.joinedUser?.join}
          </button>
        )}
      </div>

      <div id="join_popover" className={styles.buttons} popover="auto">
        <button
          onClick={toggleToFavorites}
          disabled={!favorite && favoriteLength === 5}
          className={styles.button}
          popoverTarget="join_popover"
          popoverTargetAction="hide">
          {favorite ? <IoMdCheckmark size="1rem" /> : <IoMdAdd size="1.5rem" />}
          {favorite ? translated.joinedUser?.addedToFav : translated.joinedUser?.addToFavorite}
        </button>
        {<p>{favoriteLength < 5 ? translated.joinedUser?.maxFav : translated.joinedUser?.maximumAchieved}</p>}
        <Separator />
        <button onClick={toggleToGroup} className={styles.leaveGroup}>
          Opuść grupe
        </button>
      </div>

      <Tabs.Root className={styles.tabs} lazyMount unmountOnExit defaultValue={contentList[0]}>
        <Tabs.List className={styles.tablist}>
          {contentList.map((tab, i) =>
            i === 1 && !join ? null : (
              <Tabs.Trigger key={tab} className={styles.tab} value={tab!}>
                {tab}
              </Tabs.Trigger>
            ),
          )}
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value={contentList[0]!}>
          {join ? (
            <>
              <AddingPost
                groupId={groupId!}
                translatedPost={translated.posts!}
                errorTr={translated.error!}
                authorId={userData?.id!}
                roleId={roleId}
              />
              <Posts
                groupId={groupId!}
                profilePhoto={userData?.profilePhoto!}
                userId={userData?.id!}
                name={name}
                firstPosts={firstPosts}
              />
            </>
          ) : (
            <p className={styles.noPermission}>{translated.groupSections?.noPermission}</p>
          )}
        </Tabs.Content>
        {join && (
          <Tabs.Content value={contentList[1]!}>
            <Members
              admin={joined.admin}
              groupId={groupId}
              name={name!}
              usersGroupsId={usersGroupsId!}
              members={members}
              translated={translated}
              userData={userData}
            />
          </Tabs.Content>
        )}
        <Tabs.Content value={contentList[2]!}>
          <DescriptionSection
            description={description}
            regulation={regulation}
            admin={joined.admin}
            groupId={groupId!}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};
