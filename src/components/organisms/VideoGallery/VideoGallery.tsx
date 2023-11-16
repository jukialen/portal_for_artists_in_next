// 'use client'

// import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

import { FileType, UserType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { dateData } from 'helpers/dateData';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Videos } from 'components/molecules/Videos/Videos';
// import { cookies } from "next/headers";

export const VideoGallery = ({ id, pseudonym, language }: UserType) => {
  // const [userVideos, setUserVideos] = useState<FileType[]>([]);
  // const [lastVisible, setLastVisible] = useState<FileType>();
  // let [i, setI] = useState(1);

  const pathname = usePathname()
  // const { locale } = useRouter();
  // const dataDateObject = dateData();

  // console.log('cookie', cookies().toString())
  const maxItems = 30;

  // const firstVideos = async () => {
  //   try {
  //     const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
  //       params: {
  //         queryData: {
  //           where: {
  //             AND: [{ tags: 'videos' }, { authorId: id }],
  //           },
  //           orderBy: { name: 'desc' },
  //           limit: maxItems,
  //           cursor: lastVisible,
  //         },
  //       },
  //     });
  //
  //     const filesArray: FileType[] = [];
  //
  //     for (const file of firstPage.data) {
  //       const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;
  //
  //       filesArray.push({
  //         fileId,
  //         name,
  //         fileUrl: `https://${cloudFrontUrl}/${file.name}`,
  //         pseudonym,
  //         shortDescription,
  //         profilePhoto,
  //         authorId,
  //         time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
  //       });
  //     }
  //
  //     setUserVideos(filesArray);
  //     filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
  //   } catch (e) {
  //     console.log('No such document!', e);
  //   }
  // };
  //
  // useEffect(() => {
  //   !!id && firstVideos();
  // }, [id]);

  // const nextElements = async () => {
  //   try {
  //     const nextPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
  //       params: {
  //         queryData: {
  //           where: {
  //             AND: [{ tags: 'videos' }, { authorId: id }],
  //           },
  //           orderBy: { name: 'desc' },
  //           limit: maxItems,
  //           cursor: lastVisible,
  //         },
  //       },
  //     });
  //
  //     const nextArray: FileType[] = [];
  //
  //     for (const file of nextPage.data) {
  //       const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;
  //
  //       nextArray.push({
  //         fileId,
  //         name,
  //         fileUrl: `https://${cloudFrontUrl}/${file.name}`,
  //         pseudonym,
  //         shortDescription,
  //         profilePhoto,
  //         authorId,
  //         time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
  //       });
  //     }
  //
  //     const newArray = userVideos.concat(...nextArray);
  //     setUserVideos(newArray);
  //     setI(++i);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <article>
      {decodeURIComponent(pathname!) === `/account/${pseudonym}` && (
        <h2 className="title">{language?.Account?.gallery?.userVideosTitle}</h2>
      )}

      {/*<Wrapper>*/}
      {/*  {userVideos.length > 0 ? (*/}
      {/*    userVideos.map(*/}
      {/*      (*/}
      {/*        { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,*/}
      {/*        index,*/}
      {/*      ) => (*/}
      {/*        <Videos*/}
      {/*          key={index}*/}
      {/*          fileId={fileId!}*/}
      {/*          name={name!}*/}
      {/*          fileUrl={fileUrl}*/}
      {/*          shortDescription={shortDescription!}*/}
      {/*          tags={tags!}*/}
      {/*          authorName={pseudonym!}*/}
      {/*          profilePhoto={profilePhoto}*/}
      {/*          authorId={authorId}*/}
      {/*          time={time}*/}
      {/*        />*/}
      {/*      ),*/}
      {/*    )*/}
      {/*  ) : (*/}
      {/*    <ZeroFiles text={language?.ZeroFiles?.videos} />*/}
      {/*  )}*/}
      
      {/*  {!!lastVisible && userVideos.length === maxItems * i && <MoreButton nextElements={nextElements} />}*/}
      {/*</Wrapper>*/}
    </article>
  );
};