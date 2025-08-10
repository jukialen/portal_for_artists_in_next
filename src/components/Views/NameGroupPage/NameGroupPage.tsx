'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Separator, Tabs } from '@chakra-ui/react';

import { createClient } from 'utils/supabase/clientCSR';

import { JoinUser, MemberType, nameGroupTranslatedType, PostsType, UserType } from 'types/global.types';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { Members } from 'components/atoms/Members/Members';
import { AddingPost } from 'components/molecules/AddingPost/AddingPost';
import { DescriptionSection } from 'components/molecules/DescriptionSection/DescriptionSection';
import { Posts } from 'components/organisms/Posts/Posts';

import styles from './NameGroupPage.module.scss';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';

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
  firstPosts: PostsType[] | undefined;
}) => {
  const [join, setJoin] = useState(joined.join);
  const [favorite, setFavorite] = useState(joined.favorite);
  const [favoriteLength, setFavoriteLength] = useState(joined.favoriteLength);
  const [deleteGroupInfo, setDeleteGroupInfo] = useState('');
  const [roleId, setRoleId] = useState(joined.roleId);

  const description = joined.description;
  const regulation = joined.regulation !== '' ? joined.regulation.split('\n').join('\n') : translated?.noRegulation!;
  const groupId = joined.groupId;

  const supabase = createClient();

  const { push } = useRouter();

  const selectedColor = '#FFD068';
  const hoverColor = '#FF5CAE';
  const activeColor = '#4F8DFF';
  const checkIcon = '1rem';
  const smallIcon = '1.5rem';
  const zeroPadding = 0;
  const addingToGroup = { background: activeColor, color: '#000' };
  const addingToGroupOutline = { background: 'transparent', color: activeColor };

  const contentList = [
    translated.groupSections?.general,
    translated.groupSections?.members,
    translated.groupSections?.description,
  ];

  const toggleToGroup = async () => {
    try {
      if (!join) {
        const { data, error } = await supabase
          .from('Roles')
          .insert([{ groupId, name, userId: userData?.id!, role: 'USER' }])
          .select('id')
          .limit(1)
          .single();

        if (!!data) {
          setRoleId(data.id);

          await supabase
            .from('UsersGroups')
            .insert([{ name, groupId, description, userId: userData?.id!, roleId: data?.id! }])
            .select();
        } else {
          console.error(`Unexpected error occurred. \n\n Error: ${error?.message} \n\n Code: ${error?.code}`);
        }
      } else {
        let { data, error } = await supabase
          .from('UsersGroups')
          .delete()
          .eq('usersGroupsId', usersGroupsId)
          .eq('userId', userData?.id!)
          .select('roleId')
          .limit(1)
          .single();

        if (!!data) {
          const { error: er } = await supabase.from('Roles').delete().eq('id', data.roleId).select();

          !!error && console.error(`Unexpected error occurred. \n\n Error: ${er?.message} \n\n Code: ${er?.code}`);
        } else {
          console.error(`Unexpected error occurred. \n\n Error: ${error?.message} \n\n Code: ${error?.code}`);
        }
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

        if (!!error) {
          console.error(`Unexpected error occurred. \n\n Error: ${error?.code}`);
        } else {
          setFavoriteLength(favoriteLength - 1);
        }
      } else {
        const { count } = await supabase
          .from('UsersGroups')
          .select()
          .eq('userId', userData?.id!);

        if (count === null || count < 5) {
          const { error } = await supabase
            .from('UsersGroups')
            .update({ favorite: true })
            .eq('usersGroupsId', usersGroupsId);
          if (!!error) {
            console.error(`Unexpected error occurred. \n\n Error: ${error?.code}`);
          } else {
            setFavoriteLength((count! && count + 1) || 1);
          }
        } else {
          setFavoriteLength(5);
        }
      }
      setFavorite(!favorite);
    } catch (e) {
      console.error(e);
    }
  };
  const removeGroup = async () => {
    const { error } = await supabase.from('Groups').delete().eq('groupId', groupId).eq('name', name);

    try {
      push('/app');
    } catch (e) {
      console.error(`Error occurred: ${error?.message} with status ${error?.code}`);
      setDeleteGroupInfo(translated.error!);
    }
  };

  return (
    <>
      {joined.admin ? (
        <>
          <div className={styles.adminButtons}>
            <Button colorScheme="blue" className={styles.button} onClick={removeGroup}>
              {translated.groupSections?.deleteGroup}
            </Button>
          </div>
          {!!deleteGroupInfo && <Alerts valueFields={deleteGroupInfo} />}
        </>
      ) : (
        <div className={styles.buttons}>
          <Button
            style={join ? addingToGroupOutline : addingToGroup}
            colorScheme="blue"
            onClick={toggleToGroup}
            variant={join ? 'outline' : 'solid'}
            className={styles.button}>
            {join ? <IoMdCheckmark size={checkIcon} /> : <IoMdAdd size={smallIcon} />}
            {join ? translated.joinedUser?.joined : translated.joinedUser?.join}
          </Button>

          {join && (
            <div>
              <Button
                style={favorite ? addingToGroupOutline : addingToGroup}
                colorScheme="blue"
                disabled={!favorite && favoriteLength === 5}
                onClick={toggleToFavorites}
                variant={favorite ? 'solid' : 'outline'}
                className={`${styles.button} ${styles.favoriteButton}`}>
                {favorite ? <IoMdCheckmark size={checkIcon} /> : <IoMdAdd size={smallIcon} />}
                {favorite ? translated.joinedUser?.addedToFav : translated.joinedUser?.addToFavorite}
              </Button>
              {!favorite && (
                <p>{favoriteLength < 5 ? translated.joinedUser?.maxFav : translated.joinedUser?.maximumAchieved}</p>
              )}
            </div>
          )}
        </div>
      )}
      <Separator orientation="horizontal" className={styles.hr} />

      <Tabs.Root className={styles.tabs} lazyMount fitted variant="subtle">
        <Tabs.List className={styles.tablist} role="tablist">
          {contentList.map((content, index) => (
            <Tabs.Trigger
              key={index}
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              _selected={{ borderColor: selectedColor }}
              borderColor={activeColor}
              className={styles.tab}
              role="tab"
              value={content!}>
              {content}
            </Tabs.Trigger>
          ))}
          <Tabs.Trigger
            _hover={{ borderColor: hoverColor }}
            _active={{ borderColor: activeColor }}
            _selected={{ borderColor: selectedColor }}
            borderColor={activeColor}
            className={styles.tab}
            role="tab"
            value={contentList[0]!}>
            {contentList[0]}
          </Tabs.Trigger>
          {join && (
            <Tabs.Trigger
              _hover={{ borderColor: hoverColor }}
              _active={{ borderColor: activeColor }}
              _selected={{ borderColor: selectedColor }}
              borderColor={activeColor}
              className={styles.tab}
              role="tab"
              value={contentList[1]!}>
              {contentList[1]}
            </Tabs.Trigger>
          )}
          <Tabs.Trigger
            _hover={{ borderColor: hoverColor }}
            _active={{ borderColor: activeColor }}
            _selected={{ borderColor: selectedColor }}
            borderColor={activeColor}
            className={styles.tab}
            role="tab"
            value={contentList[2]!}>
            {contentList[2]}
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>

        <Tabs.List padding={zeroPadding}>
          <Tabs.Content value={contentList[0]!} padding={zeroPadding}>
            <>
              {join && (
                <AddingPost
                  groupId={joined.groupId!}
                  translatedPost={translated.posts!}
                  errorTr={translated.error!}
                  authorId={userData?.id!}
                  roleId={roleId}
                />
              )}
              {join ? (
                <Posts
                  groupId={joined.groupId!}
                  profilePhoto={userData?.profilePhoto!}
                  userId={userData?.id!}
                  name={name}
                  firstPosts={firstPosts}
                />
              ) : (
                <p className={styles.noPermission}>{translated.groupSections?.noPermission}</p>
              )}
            </>
          </Tabs.Content>
          {join && (
            <Tabs.Content value={contentList[1]!} padding={zeroPadding}>
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
          <Tabs.Content value={contentList[2]!} padding={zeroPadding}>
            <DescriptionSection
              description={description}
              regulation={regulation}
              admin={joined.admin}
              groupId={groupId!}
            />
          </Tabs.Content>
        </Tabs.List>
      </Tabs.Root>
    </>
  );
};
