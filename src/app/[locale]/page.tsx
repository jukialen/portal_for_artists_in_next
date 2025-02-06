import { Metadata } from 'next';
import Image from 'next/image';
import { setStaticParamsLocale } from 'next-international/server';

import { getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import styles from './page.module.scss';
import dark_mode from '../../../public/dark_mode.png';
import light_mode from '../../../public/light_mode.png';
import friends from '../../../public/friends.png';
import categories from '../../../public/categories.png';
import groups from '../../../public/groups.png';
import diary from '../../../public/diary.jpg';
import artist from '../../../public/artist.jpg';
import searchingService from '../../../public/searching.jpg';
import upload from '../../../public/upload.png';
import authorButton from '../../../public/authorButton.png';
import top from '../../../public/top.jpg';
import minimalism from '../../../public/minimalism.png';
import likes from '../../../public/likes.png';

export const metadata: Metadata = HeadCom('Main site.');

export default async function Home({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n('Main');
  const width = 450;
  const height = 320;
  const quality = 100;

  return (
    <>
      <div className={styles.group__element}>
        <h2 className={styles.title}>{t('title')}</h2>

        <div className={styles.question}>
          <h2>{t('firstQuestion')}</h2>
          <Image src={searchingService} width={width} height={height} alt="image for first question" />
        </div>

        <div className={styles.question}>
          <h2>{t('secondQuestion')}</h2>
          <Image src={diary} width={width} height={height} alt="image for second question" />
        </div>

        <div className={styles.question}>
          <h3>
            {t('firstAnswer')} {t('secondAnswer')}
          </h3>
          <Image src={artist} width={width} height={height} alt="image for answer" />
        </div>
      </div>
      <article className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>{t('containerFirstQuestion')}</h4>
          <p className={styles.answer}>{t('containerFirstAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerSecondQuestion')}</h4>

          <p className={styles.answer}>{t('containerSecondAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerThirdQuestion')}</h4>

          <p className={styles.answer}>{t('containerThirdAnswer')}</p>
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
            {t('containerFourthQuestion')}
            <br />
          </h4>

          <p className={styles.answer}>{t('containerFourthAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerFifthQuestion')}</h4>

          <p className={styles.answer}>{t('containerFifthAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerSixthQuestion')}</h4>

          <p className={styles.answer}>{t('containerSixthAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerSeventhQuestion')}</h4>

          <p className={styles.answer}>{t('containerSeventhAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerEighthQuestion')}</h4>

          <p className={styles.answer}>{t('containerEighthAnswer')}</p>
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
          <h4 className={styles.question}>{t('containerNinthQuestion')}</h4>

          <p className={styles.answer}>{t('containerNinthAnswer')}</p>
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
    </>
  );
}
