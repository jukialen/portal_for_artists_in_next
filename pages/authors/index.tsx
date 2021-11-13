import { useRouter } from "next/router";
import useSWR from "swr";
import Head from "next/head";

const Authors = () => {
  const { locale, asPath } = useRouter()
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${locale}.json`, fetcher);
  
  return (
    <section className='workspace'>
      <Head>
        <link rel='alternate' hrefLang={locale} href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '' : `/${locale}`}${asPath}`} />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='Site about project authors' />
        <title>{data?.title}</title>
      </Head>
      
      <h2>Tutaj będą znajdować się informacje o autorach projektu</h2>
    </section>
  );
};

export default Authors;
