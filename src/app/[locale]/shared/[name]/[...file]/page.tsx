import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { TagConstants } from 'constants/values';
import { FileType, LangType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { getFileRoleId } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

import { Videos } from 'components/molecules/Videos/Videos';
import { Article } from 'components/molecules/Article/Article';

type PropsType = {
  params: Promise<{
    locale: LangType;
    name: string;
    file: string[];
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
      authorId: authorId!,
      authorName: d?.pseudonym!,
      authorProfilePhoto: d?.profilePhoto!,
      fileUrl,
      shortDescription: shortDescription!,
      roleId,
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

  const pseudonym = await getUserData().then((t) => t?.pseudonym!);
  const authorPost = await oneFile(fileId);

  return (
    <>
      {authorPost?.tags! === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
        <Videos
          fileId={fileId}
          name={name}
          fileUrl={authorPost?.fileUrl!}
          shortDescription={authorPost?.shortDescription!}
          tags={authorPost?.tags!}
          authorName={authorPost?.authorName!}
          profilePhoto={authorPost?.authorProfilePhoto!}
          authorId={authorPost?.authorId!}
          time={authorPost?.time!}
          authorBool={authorPost?.authorName! === pseudonym}
          roleId={authorPost?.roleId!}
        />
      ) : (
        <Article
          fileId={fileId}
          name={name}
          fileUrl={authorPost?.fileUrl!}
          shortDescription={authorPost?.shortDescription!}
          tags={authorPost?.tags!}
          authorName={authorPost?.authorName!}
          profilePhoto={authorPost?.authorProfilePhoto!}
          authorId={authorPost?.authorId!}
          time={authorPost?.time!}
          authorBool={authorPost?.authorName! === pseudonym}
          roleId={authorPost?.roleId!}
        />
      )}
    </>
  );
}
