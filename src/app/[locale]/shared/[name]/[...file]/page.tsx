import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { FileType, LangType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { getFileRoleId } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
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
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Files')
      .select('fileUrl, shortDescription, tags, authorId, createdAt, updatedAt')
      .eq('fileId', fileId)
      .limit(1)
      .single();

    if (!!error) {
      console.error(error);
      return;
    }

    const { data: d, error: er } = await supabase
      .from('Users')
      .select('pseudonym, profilePhoto')
      .eq('id', data?.authorId!)
      .limit(1)
      .maybeSingle();

    if (!!er) {
      console.error(er);
      return;
    }

    const { fileUrl, shortDescription, tags, authorId, createdAt, updatedAt } = data;

    const roleId = await getFileRoleId(fileId, authorId!);

    if (roleId === 'no id') return;

    const postData: FileType = {
      authorName: d?.pseudonym!,
      authorProfilePhoto: d?.profilePhoto!,
      fileUrl,
      shortDescription: shortDescription!,
      tags,
      time: await getDate(updatedAt! || createdAt!, await dateData()),
    };

    return postData;
  } catch (e) {
    console.error(e);
  }
}

export default async function Post({ params }: PropsType) {
  const { locale, name, file } = await params;
  setStaticParamsLocale(locale);

  const fileId = file[1];

  const authorPost = await oneFile(fileId);
  const userData = await getUserData();

  const { fileUrl, shortDescription, tags, authorName, time } = authorPost!;

  return (
    <FileContainer
      fileId={fileId!}
      name={name!}
      fileUrl={fileUrl}
      shortDescription={shortDescription!}
      tags={tags!}
      authorName={authorName!}
      authorBool={authorName === userData?.pseudonym!}
      time={time}
    />
  );
}
