import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { getFileRoleId } from 'app/actions/roles';
import { likeList } from 'app/actions/likes';
import { createServer } from 'utils/supabase/clientSSR';

const FileContainer = dynamic(() =>
  import('components/functional/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

type PropsType = {
  params: Promise<{
    locale: LangType;
    name: string;
    file: string[];
    noComments: string;
  }>;
};

export async function generateMetadata({ params }: PropsType): Promise<Metadata> {
  const { file } = await params;

  const authorName = decodeURIComponent(file[1]);

  return { ...HeadCom(`${authorName} user post subpage`) };
}

async function oneFile(fileId: string) {
  const supabase = await createServer();

  try {
    const { data, error } = await supabase
      .from('Files')
      .select(
        'fileId, fileUrl, shortDescription, tags, authorId, createdAt, updatedAt, Users!authorId (pseudonym, profilePhoto)',
      )
      .eq('fileId', fileId)
      .limit(1)
      .maybeSingle();

    if (!!error || !data) {
      console.error('/[...file] error', error);
      return;
    }

    const role = await getFileRoleId(fileId, data.authorId!);

    const { fileUrl, shortDescription, tags, authorId, createdAt, updatedAt, Users } = data;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('basic')
      .createSignedUrl(fileUrl, 3600 * 24);

    if (storageError) return;

    return {
      authorName: Users!.pseudonym,
      authorProfilePhoto: Users!.profilePhoto,
      fileUrl: storageData?.signedUrl,
      shortDescription: shortDescription!,
      tags,
      roleId: role.roleId,
      authorId: authorId!,
      time: await getDate(updatedAt! || createdAt!),
      liked: (await likeList(authorId!, 'fileId', fileId)).liked,
      likes: (await likeList(authorId!, 'fileId', fileId)).likes,
      idLiked: (await likeList(authorId!, 'fileId', fileId)).idLiked,
      fileId,
    };
  } catch (e) {
    console.error(e);
    return;
  }
}

export default async function Post({ params }: PropsType) {
  const { locale, file } = await params;
  setStaticParamsLocale(locale);

  const userData = await getUserData();
  const fileId = file[0];

  const authorPost = await oneFile(fileId);

  if (!authorPost) return notFound();

  return (
    <FileContainer
      fileData={{ ...authorPost, authorBool: authorPost.authorName === userData?.pseudonym!, commentsBool: true }}
    />
  );
}
