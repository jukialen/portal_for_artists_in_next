import { Metadata } from 'next';
import Image from 'next/image';
import { setStaticParamsLocale } from 'next-international/server';

import { getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { ContainerType, LangType } from 'types/global.types';

import { HomeImageContainers } from 'components/atoms/HomeImageContainers/HomeImageContainers';

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

  const containerData: ContainerType[] = [
    {
      question: t('containerFirstQuestion'),
      answer: t('containerFirstAnswer'),
      imageSource: [upload],
      imageAlt: ['picture.jpg'],
      quality,
    },
    {
      question: t('containerSecondQuestion'),
      answer: t('containerSecondAnswer'),
      imageSource: [authorButton],
      imageAlt: ['picture.jpg'],
      quality,
    },
    {
      question: t('containerThirdQuestion'),
      answer: t('containerThirdAnswer'),
      imageSource: [top],
      imageAlt: ['sign in photo file'],
      quality,
    },
    {
      question: (
        <>
          {t('containerFourthQuestion')}
          <br />
        </>
      ),
      answer: t('containerFourthAnswer'),
      imageSource: [likes],
      imageAlt: ['picture.jpg'],
      quality,
    },
    {
      question: t('containerFifthQuestion'),
      answer: t('containerFifthAnswer'),
      imageSource: [minimalism],
      imageAlt: ['sign in photo file'],
      quality,
    },
    {
      question: t('containerSixthQuestion'),
      answer: t('containerSixthAnswer'),
      imageSource: [light_mode, dark_mode],
      imageAlt: ['light mode photo file', 'dark mode photo file'],
      quality,
      mode: true,
    },
    {
      question: t('containerSeventhQuestion'),
      answer: t('containerSeventhAnswer'),
      imageSource: [categories],
      imageAlt: ['categories photo file'],
      quality,
    },
    {
      question: t('containerEighthQuestion'),
      answer: t('containerEighthAnswer'),
      imageSource: [groups],
      imageAlt: ['groups photo file'],
      quality,
    },
    {
      question: t('containerNinthQuestion'),
      answer: t('containerNinthAnswer'),
      imageSource: [friends],
      imageAlt: ['friends photo file'],
      quality,
    },
  ];

  return (
    <>
      <div className={styles.group__element}>
        <h2 className={styles.title}>{t('title')}</h2>

        <div className={styles.question}>
          <h2>{t('firstQuestion')}</h2>
          <Image src={searchingService} width={width} height={height} alt="image for first question" priority />
        </div>

        <div className={styles.question}>
          <h2>{t('secondQuestion')}</h2>
          <Image src={diary} width={width} height={height} alt="image for second question" priority />
        </div>

        <div className={styles.question}>
          <h3>
            {t('firstAnswer')} {t('secondAnswer')}
          </h3>
          <Image src={artist} width={width} height={height} alt="image for answer" priority />
        </div>
      </div>
      <HomeImageContainers containerData={containerData} width={width} height={height} />
    </>
  );
}
