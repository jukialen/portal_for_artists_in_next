import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';

import { HeadCom } from 'constants/HeadCom';
import { DateObjectType, LangType, PostsType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { createServer } from 'utils/supabase/clientSSR';

import { Post } from 'components/molecules/Post/Post';

type PropsType = Promise<{
  locale: LangType;
  name: string;
  post: string[];
}>;

export async function generateMetadata({ params }: { params: PropsType }): Promise<Metadata> {
  const { name, post } = await params;
  const authorName = decodeURIComponent(post[0]);

  return { ...HeadCom(`${authorName} user post subpage for group ${name}`) };
}

async function postOne(postId: string, name: string, dataDateObject: DateObjectType) {
  let postsArray: PostsType = {
    authorId: '',
    authorName: '',
    authorProfilePhoto: '',
    commented: 0,
    content: '',
    groupId: '',
    liked: false,
    likes: 0,
    roleId: '',
    shared: 0,
    title: '',
    idLiked: '',
  };

  const supabase = await createServer();

  const { data } = await supabase
    .from('Posts')
    .select('*, Users (pseudonym, profilePhoto), Roles (id)')
    .match({ postId, title: name })
    .order('createdAt', { ascending: false });

  for (const post of data!) {
    const { title, content, likes, shared, commented, authorId, groupId, createdAt, updatedAt, Users, Roles } = post;

    const { data: lData } = await supabase.from('Liked').select('id, userId').match({ postId, userId: authorId });

    const indexCurrentUser = lData?.findIndex((v) => v.userId === authorId) || -1;

    postsArray = {
      authorName: Users?.pseudonym!,
      authorProfilePhoto: Users?.profilePhoto!,
      liked: indexCurrentUser >= 0,
      postId,
      title,
      content,
      likes,
      shared,
      commented,
      authorId,
      groupId,
      roleId: Roles?.id!,
      date: await getDate(updatedAt! || createdAt!, dataDateObject),
      idLiked: !!lData && lData?.length > 0 ? lData[indexCurrentUser].id : '',
    };
  }
  return postsArray;
}

export default async function PostFromGroup({ params }: { params: PropsType }) {
  const { locale, name, post } = await params;
  setStaticParamsLocale(locale);

  const postId = post[1];

  const userData = await getUserData();

  const postOnGroup = await postOne(postId, name, await dateData());

  if (!postOnGroup) return notFound();

  return <Post userId={userData?.id!} name={name} postOnGroup={postOnGroup!} profilePhoto={userData?.profilePhoto!} />;
}
