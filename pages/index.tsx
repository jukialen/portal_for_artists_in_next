import { useContext, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import { useHookSWR } from 'hooks/useHookSWR';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Footer } from 'components/molecules/Footer/Footer';

import { StatusLoginContext } from 'providers/StatusLogin';

import styles from './index.module.scss';
import dark_mode from 'public/dark_mode.png';
import light_mode from 'public/light_mode.png';
import friends from 'public/friends.png';
import categories from 'public/categories.png';
import groups from 'public/groups.png';
import diary from 'public/diary.jpg';
import artist from 'public/artist.jpg';
import searchingService from 'public/searching.jpg';
import upload from 'public/upload.png';
import authorButton from 'public/authorButton.png';
import top from 'public/top.jpg';
import minimalism from 'public/minimalism.png';
import likes from 'public/likes.png';

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

      const sections = document.querySelectorAll('article');
      return sections.forEach((section: HTMLElement) => {
        gsap.fromTo(
          section.children,
          { y: '+=250', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: 'easeOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: '80% 80%',
              scrub: 3,
            },
          },
        );
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const width = 450;
  const height = 320;
  const quality = 100;

  return (
    <>
      <HeadCom path={asPath} content="Pfartists" />

      <div className={styles.group__element}>
        <h2 className={styles.title}>{data?.Main?.title}</h2>

        <div className={styles.question}>
          <h2>{data?.Main?.firstQuestion}</h2>
          <Image src={searchingService} width={width} height={height} alt="image for first question" />
        </div>

        <div className={styles.question}>
          <h2>{data?.Main?.secondQuestion}</h2>
          <Image src={diary} width={width} height={height} alt="image for second question" />
        </div>

        <div className={styles.question}>
          <h3>
            {data?.Main?.firstAnswer} {data?.Main?.secondAnswer}
          </h3>
          <Image src={artist} width={width} height={height} alt="image for answer" />
        </div>
      </div>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerFirstQuestion}</h4>
          <p className={styles.answer}>{data?.Main?.containerFirstAnswer}</p>
        </div>

        <Image
          src={upload}
          width={width}
          height={height}
          className={styles.image}
          alt="picture.jpg"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerSecondQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerSecondAnswer}</p>
        </div>

        <Image
          src={authorButton}
          width={width}
          height={height}
          className={styles.image}
          alt="picture.jpg"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerThirdQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerThirdAnswer}</p>
        </div>

        <Image
          src={top}
          width={width}
          height={height}
          className={styles.image}
          alt="sign in photo file"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            {data?.Main?.containerFourthQuestion}
            <br />
          </h4>

          <p className={styles.answer}>{data?.Main?.containerFourthAnswer}</p>
        </div>

        <Image
          src={likes}
          width={width}
          height={height}
          className={styles.image}
          alt="picture.jpg"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerFifthQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerFifthAnswer}</p>
        </div>

        <Image
          src={minimalism}
          width={width}
          height={height}
          className={styles.image}
          alt="sign in photo file"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container__mode}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerSixthQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerSixthAnswer}</p>
        </div>

        <div className={styles.image}>
          <div className={styles.modeImage}>
            <Image src={light_mode} width={width} height={height} alt="picture.jpg" priority quality={quality} />
            <Image
              src={dark_mode}
              width={width}
              height={height}
              alt="dark mode photo file"
              priority
              quality={quality}
            />
          </div>
        </div>
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerSeventhQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerSeventhAnswer}</p>
        </div>

        <Image
          src={categories}
          width={width}
          height={height}
          className={styles.image}
          alt="categories photo file"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerEighthQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerEighthAnswer}</p>
        </div>

        <Image
          src={groups}
          width={width}
          height={height}
          className={styles.image}
          alt="groups photo file"
          priority
          quality={quality}
        />
      </article>

      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{data?.Main?.containerNinthQuestion}</h4>

          <p className={styles.answer}>{data?.Main?.containerNinthAnswer}</p>
        </div>

        <Image
          src={friends}
          width={width}
          height={height}
          className={styles.image}
          alt="friends photo file"
          priority
          quality={quality}
        />
      </article>

      <Footer />
    </>
  );
}
