import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useSWR from 'swr';

import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './index.module.scss';

export default function Home() {
  const { isUser } = useContext(StatusLoginContext);
  
  const { locale, asPath, push } = useRouter();
  
  useEffect(() => {
    isUser && push('/app')
  }, [isUser]);
  
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${locale}.json`, fetcher);
  
  const image = 320;
  
  return (
    <div className='workspace'>
      <Head>
        <link
          rel='alternate'
          hrefLang={locale}
          href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '' : `/${locale}`}${asPath}`}
        />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='Main site.' />
        <title>{data?.title}</title>
      </Head>
      
      <h1 className={styles.title}>{data?.Main?.title}</h1>
      
      <h3 className={styles.h3}>
        {data?.Main?.firstQuestion}
        <br />
        <br />
        {data?.Main?.secondQuestion}
      </h3>
      
      <h2 className={styles.h2}>
        {data?.Main?.firstAnswer}
        <br />
        <br />
        {data?.Main?.secondAnswer}
      </h2>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFirstQuestion}
          </h4>
          <p className={styles.answer}>
            {data?.Main?.containerFirstAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerSecondQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerSecondAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerThirdQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerThirdAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFourthQuestion}<br />
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerFourthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFifthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerFifthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerSixthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerSixthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerSeventhQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerSeventhAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerEighthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerEighthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerNinthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {data?.Main?.containerNinthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
    </div>
  );
}

