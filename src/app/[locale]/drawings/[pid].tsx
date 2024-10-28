import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import axios from 'axios';

import { HeadCom } from 'constants/HeadCom';
import { backUrl, cloudFrontUrl } from 'constants/links';
import { DateObjectType, FileType, LangType } from 'types/global.types';

import { getI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { DrawingsWrapper } from 'components/molecules/DrawingsWrapper/DrawingsWrapper';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sites with drawings and photos.');

async function getFirstDrawings(pid: string, maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
      params: {
        queryData: {
          orderBy: { createdAt: 'desc' },
          where: { tags: pid },
          limit: maxItems,
        },
      },
    });

    for (const file of firstPage.data) {
      const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym,
        profilePhoto,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }

    return filesArray;
  } catch (e) {
    console.error(e);
    console.log('No such drawings!');
  }
}

export default async function Drawings({ params: { locale, pid } }: { params: { locale: LangType; pid: string } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const tDrawingsCategories = {
    category: t('Aside.category'),
    noDrawings: t('ZeroFiles.files'),
  };

  const dataDateObject = await dateData();

  const drawings = await getFirstDrawings(pid, 30, locale, dataDateObject);
  
  return (
    <>
      <em className={styles.title}>
        {tDrawingsCategories.category}: {pid}
      </em>

      <Wrapper>
        <DrawingsWrapper
          locale={locale}
          pid={pid}
          dataDateObject={dataDateObject}
          noDrawings={tDrawingsCategories.noDrawings}
          filesDrawings={drawings}
        />
      </Wrapper>
    </>
  );
}
