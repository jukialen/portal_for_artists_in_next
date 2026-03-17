import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { getFileRoleId } from 'utils/roles';
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
      time: await getDate(updatedAt! || createdAt!, await dateData()),
    };
  } catch (e) {
    console.error(e);
    return;
  }
}

export default async function Post({ params }: PropsType) {
  const { locale, name, file } = await params;
  setStaticParamsLocale(locale);

  const fileId = file[0];

  const authorPost = await oneFile(fileId);
  const userData = await getUserData();

  console.log('authorPost', authorPost);

  const { fileUrl, shortDescription, tags, authorName, time, authorId, roleId } = authorPost!;

  return (
    <FileContainer
      fileId={fileId}
      name={name}
      fileUrl={fileUrl}
      shortDescription={shortDescription!}
      tags={tags}
      authorName={authorName}
      authorBool={authorName === userData?.pseudonym!}
      time={time}
      authorId={authorId}
      roleId={roleId}
      commentsBool={true}
    />
  );
}
