import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';

import { AuthorPost } from 'components/organisms/AuthorPost/AuthorPost';

export async function generateMetadata({ post }: { post: string }): Promise<Metadata> {
  const pseudonym = decodeURIComponent(post.split('/')[2]);

  return { ...HeadCom(`${pseudonym} user post subpage`) };
}

export default function Post({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  return <AuthorPost locale={locale} />;
}
