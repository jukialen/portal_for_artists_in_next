import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { useHookSWR } from 'hooks/useHookSWR';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './index.module.scss';
import dark_mode from 'public/dark_mode.jpg';
import light_mode from 'public/light_mode.jpg';
import friends from 'public/friends.png';
import categories from 'public/categories.png'
import groups from 'public/groups.png';
import sign_in from 'public/signin.jpg';
import diary from 'public/diary.jpg';
import artist from 'public/artist.jpg';
import searchingService from 'public/searching.jpg';

export default function Home() {
  const { isUser } = useContext(StatusLoginContext);
  const { asPath, push } = useRouter();
  
  const data = useHookSWR();

  useEffect(() => {
    isUser && push('/app');
  }, [isUser]);
  
  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
  
      const sections = document.querySelectorAll('section');
      sections.forEach((section: HTMLElement) => {
        gsap.fromTo(section.children, { y: '+=200', opacity: 0}, { y: 0, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'easeInOut', scrollTrigger: {
            trigger: section,
            start: 'top 140%',
            end: 'button 40%',
            scrub: 3
          }});
      });
    }
    catch (e) {
      console.log(e);
    }
  }, [])
  
  const image = 320;
  
  return (
    <>
      <HeadCom path={asPath} content='Main site.' />
      
      <div className={styles.group__element}>
        <h2 className={styles.title}>{data?.Main?.title}</h2>
  
        <div className={styles.question}>
          <h2>{data?.Main?.firstQuestion}</h2>
          <Image src={searchingService} width={450} height={image} />
        </div>
        
        <div className={styles.question}>
          <h2>{data?.Main?.secondQuestion}</h2>
          <Image src={diary} width={450} height={image}  />
        </div>
  
        <div className={styles.question}>
          <h3>{data?.Main?.firstAnswer} {data?.Main?.secondAnswer}</h3>
          <Image src={artist} width={450} height={image} />
        </div>
      </div>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFirstQuestion}
          </h4>
          <p className={styles.answer}>
            {data?.Main?.containerFirstAnswer}
          </p>
        </div>
    
        <Image
          src={sign_in}
          width={450}
          height={image}
          className={styles.image}
          alt='picture.jpg'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerSecondQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerSecondAnswer}
          </p>
        </div>
    
        <Image
          src={sign_in}
          width={450}
          height={image}
          className={styles.image}
          alt='picture.jpg'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerThirdQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerThirdAnswer}
          </p>
        </div>
    
        <Image
          src={sign_in}
          width={450}
          height={image}
          className={styles.image}
          alt='sign in photo file'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFourthQuestion}<br />
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerFourthAnswer}
          </p>
        </div>
    
        <Image
          src={sign_in}
          width={450}
          height={image}
          className={styles.image}
          alt='picture.jpg'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFifthQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerFifthAnswer}
          </p>
        </div>
    
        <Image
          src={sign_in}
          width={450}
          height={image}
          className={styles.image}
          alt='sign in photo file'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerSixthQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerSixthAnswer}
          </p>
        </div>
    
        <div className={styles.image}>
          <div className={styles.modeImage}>
            <Image
              src={light_mode}
              width={image / 1.5}
              height={image}
              alt='picture.jpg'
              priority
              quality={100}
            />
            <Image
              src={dark_mode}
              width={image / 1.5}
              height={image}
              alt='dark mode photo file'
              priority
              quality={100}
            />
          </div>
        </div>
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerSeventhQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerSeventhAnswer}
          </p>
        </div>
    
        <Image
          src={categories}
          width={450}
          height={image}
          className={styles.image}
          alt='categories photo file'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerEighthQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerEighthAnswer}
          </p>
        </div>
    
        <Image
          src={groups}
          width={450}
          height={image}
          className={styles.image}
          alt='groups photo file'
          priority
          quality={100}
        />
      </section>
  
      <section className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerNinthQuestion}
          </h4>
      
          <p className={styles.answer}>
            {data?.Main?.containerNinthAnswer}
          </p>
        </div>
    
        <Image
          src={friends}
          width={450}
          height={image}
          className={styles.image}
          alt='friends photo file'
          priority
          quality={100}
        />
      </section>
    </>
  );
}
