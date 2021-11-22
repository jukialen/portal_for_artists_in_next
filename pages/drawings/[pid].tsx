import { useEffect } from "react";
import { GetStaticProps } from 'next'
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import Cookies from "js-cookie";
import { Wrapper } from "../../components/organisms/Wrapper/Wrapper";
import axios from "axios";

type DrawingsType = {
  context: string,
  multimedia: string,
  description: string,
  username: string,
  tags: string
}

export default function Drawings() {
  const router = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${router.locale}.json`, fetcher);
  
  const { pid } = router.query;
  console.log(pid)
  
  let user;
  
  useEffect(() => {
    user = Cookies.get('user');
    !user && router.push('/');
  }, [user]);
  
  return (
    <div className='workspace'>
      <Head>
        <link
          rel='alternate'
          hrefLang={router.locale}
          href={`${process.env.NEXT_PUBLIC_PAGE}${router.locale === 'en' ? '' : `/${router.locale}`}${router.asPath}`}
        />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='Main site.' />
        <title>{data?.title}</title>
      </Head>
      <h1>podstrona z rysunkami</h1>
      <Wrapper idWrapper='drawingsWrapper' />
    </div>
  )
};

// export const getStaticProps: GetStaticProps = async (context) => {
  
  // const user = Cookies.get('user');
  // try {
  //   const { data } = await axios.post(
  //     `${process.env.NEXT_PUBLIC_API_URL}/files`,
  //     {
  //       "multimedia",
  //       "description",
  //       "user",
  //       "tags"
  //     }, headers:
  //       {
  //         Authorization: `Bearer ${user}`,
  //       }
  // )
  //   ;
//     return {
//       props: {
//         multimedia,
//         description,
//         user,
//         tags
//       }
//     }
//   } catch (error) {
//   }
// }