import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import { useHookSWR } from 'hooks/useHookSWR';

import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './index.module.scss';

export default function Home() {
  const { isUser } = useContext(StatusLoginContext);
  
  const { locale, asPath, back } = useRouter();
  
  useEffect(() => {
    isUser && back();
  }, [isUser]);
  
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
        <title>{useHookSWR()?.title}</title>
      </Head>
      
      <h1 className={styles.title}>{useHookSWR()?.Main?.title}</h1>
      
      <h3 className={styles.h3}>
        {useHookSWR()?.Main?.firstQuestion}
        <br />
        <br />
        {useHookSWR()?.Main?.secondQuestion}
      </h3>
      
      <h2 className={styles.h2}>
        {useHookSWR()?.Main?.firstAnswer}
        <br />
        <br />
        {useHookSWR()?.Main?.secondAnswer}
      </h2>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerFirstQuestion}
          </h4>
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerFirstAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerSecondQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerSecondAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerThirdQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerThirdAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerFourthQuestion}<br />
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerFourthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerFifthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerFifthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerSixthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerSixthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerSeventhQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerSeventhAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerEighthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerEighthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {useHookSWR()?.Main?.containerNinthQuestion}
          </h4>
          
          <p className={styles.answer}>
            {useHookSWR()?.Main?.containerNinthAnswer}
          </p>
        </div>
        
        <Image src='/#' width={image} height={image} className={styles.image} alt='picture.jpg' />
      </div>
    </div>
  );
}

