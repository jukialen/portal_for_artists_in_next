import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { usePathname } from 'next/navigation';

import { HeadCom } from 'src/constants/HeadCom';

import { dateData } from 'src/helpers/dateData';

import { PostWrapper } from 'src/components/organisms/PostWrapper/PostWrapper';

export async function generateMetadata({ locale, post }: { locale: string; post: string }): Promise<Metadata> {
  const split = post.split('/');
  const containUrl = split.includes('https') || split.includes('http');

  const name = decodeURIComponent(split[containUrl ? 4 : 2]);

  return { ...HeadCom(`${name} user post subpage`) };
}

export default async function PostFromGroup({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const pathname = usePathname();

  const dataDateObject = await dateData();

  const split = pathname.split('/');
  const containUrl = split.includes('https') || split.includes('http');

  const name = decodeURIComponent(split[containUrl ? 4 : 2]);
  const postId = decodeURIComponent(split[containUrl ? 6 : 4]);

  return <PostWrapper locale={locale} name={name} postId={postId} dataDateObject={dataDateObject} />;
}
