import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { FileType, LangType, Tags } from 'types/global.types';

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
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Files')
      .select('fileUrl, shortDescription, tags, authorId, createdAt, updatedAt')
      .eq('fileId', fileId)
      .limit(1)
      .maybeSingle();

    if (!!error) {
      console.error(error);
      return {
        fileUrl: '',
        shortDescription: '',
        tags: 'others',
        authorName: '',
        time: '',
      };
    }

    const { data: d, error: er } = await supabase
      .from('Users')
      .select('pseudonym, profilePhoto')
      .eq('id', data?.authorId!)
      .limit(1)
      .maybeSingle();

    if (!!er) {
      console.error(er);
      return {
        fileUrl: '',
        shortDescription: '',
        tags: 'others',
        authorName: '',
        time: '',
      };
    }

    const { fileUrl, shortDescription, tags, createdAt, updatedAt } = data!;

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

  const fileId = file[0];

  const authorPost = await oneFile(fileId);
  const userData = await getUserData();

  const { fileUrl, shortDescription, tags, authorName, time } = authorPost!;

  const Tags = tags as Tags;

  return (
    <FileContainer
      fileId={fileId!}
      name={name!}
      fileUrl={fileUrl}
      shortDescription={shortDescription!}
      tags={Tags!}
      authorName={authorName!}
      authorBool={authorName === userData?.pseudonym!}
      time={time}
    />
  );
}
