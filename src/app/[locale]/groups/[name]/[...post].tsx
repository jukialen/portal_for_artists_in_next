import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound, usePathname } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cloudFrontUrl } from 'constants/links';
import { HeadCom } from 'constants/HeadCom';
import { DateObjectType, LangType, PostsType } from 'types/global.types';
import { Database } from 'types/database.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

import { Post } from 'components/molecules/Post/Post';

export async function generateMetadata({ post }: { post: string }): Promise<Metadata> {
  const split = post.split('/');
  const containUrl = split.includes('https') || split.includes('http');

  const name = decodeURIComponent(split[containUrl ? 4 : 2]);

  return { ...HeadCom(`${name} user post subpage`) };
}

const supabase = createServerComponentClient<Database>({ cookies });
const post = async (locale: LangType, postId: string, name: string, dataDateObject: DateObjectType) => {
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
  };

  const { data } = await supabase
    .from('Posts')
    .select('*, Users (pseudonym, profilePhoto), Roles (id)')
    .match({ postId: postId, title: name })
    .order('createdAt', { ascending: false });

  for (const post of data!) {
    const { title, content, likes, shared, commented, authorId, groupId, createdAt, updatedAt, Users, Roles } =
      post;

    const { data } = await supabase.from('Liked').select('id').match({ postId: postId, userId: authorId });
    postsArray = {
      authorName: Users?.pseudonym!,
      authorProfilePhoto: `https://${cloudFrontUrl}/${Users?.profilePhoto!}`,
      liked: !!data?.[0].id,
      postId,
      title,
      content,
      likes,
      shared,
      commented,
      authorId,
      groupId,
      roleId: Roles?.id!,
      date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
    };
  }
  return postsArray;
};

export default async function PostFromGroup({ locale }: { locale: LangType }) {
  setStaticParamsLocale(locale);

  const userData = await getUserData();

  const pathname = usePathname();

  const dataDateObject = await dateData();

  const split = pathname.split('/');
  const containUrl = split.includes('https') || split.includes('http');

  const name = decodeURIComponent(split[containUrl ? 4 : 2]);
  const postId = decodeURIComponent(split[containUrl ? 6 : 4]);

  const postOnGroup = await post(locale, postId, name, dataDateObject);

  if (!postOnGroup) return notFound();

  return <Post userId={userData?.id!} pseudonym={userData?.pseudonym!} postOnGroup={postOnGroup!} />;
}
