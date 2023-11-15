'use client'

import { useEffect, useState } from "react";
import axios from "axios";

import { FilesCommentsType } from "src/types/global.types";

import { backUrl } from "src/constants/links";

import { getDate } from "src/helpers/getDate";

import { DCProvider } from "src/providers/DeleteCommentProvider";

import { FileComment } from "src/components/atoms/FileComment/FileComment";
import { MoreButton } from "src/components/atoms/MoreButton/MoreButton";

import styles from "./FilesCommentsClient.module.scss";

type FilesCommentsClientType = {
  fileId: string;
  dataDateObject: {second: string, minute: string, hour: string, day: string, yearDateSeparator: string};
  locale: string;
  noComments: string;
}
export const FilesCommentsClient = ({ fileId, dataDateObject, locale, noComments }: FilesCommentsClientType) => {
  const [commentsArray, setCommentsArray] = useState<FilesCommentsType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);
  
  const maxItems = 30;
  
  const firstComments = async () => {
    try {
      const firstPage: { data: FilesCommentsType[] } = await axios.get(`${backUrl}/files-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: { fileId: fileId },
          limit: maxItems,
        },
      });
      
      const commentArray: FilesCommentsType[] = [];
      
      for (const first of firstPage.data) {
        const { id, fileId, comment, pseudonym, profilePhoto, role, roleId, authorId, createdAt, updatedAt } = first;
        
        commentArray.push({
          id,
          fileId,
          comment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          authorId,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }
      
      setCommentsArray(commentArray);
      commentArray.length === maxItems && setLastVisible(commentArray[commentArray.length - 1].fileId);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!fileId && firstComments();
  }, [fileId]);
  
  const nextComments = async () => {
    try {
      const nextPage: { data: FilesCommentsType[] } = await axios.get(`${backUrl}/files-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: { fileId },
          limit: maxItems,
          cursor: lastVisible,
        },
      });
      
      const nextCommentArray: FilesCommentsType[] = [];
      
      for (const next of nextPage.data) {
        const { id, fileId, comment, pseudonym, profilePhoto, role, roleId, authorId, createdAt, updatedAt } = next;
        
        nextCommentArray.push({
          id,
          fileId,
          comment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          authorId,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }
      
      nextPage.data.length === maxItems && setLastVisible(nextCommentArray[nextCommentArray.length - 1].fileId);
      
      const nextArray = commentsArray.concat(...nextCommentArray);
      setCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };
  
  return (
    <>
      {commentsArray.length > 0 ? (
        commentsArray.map(
          (
            { id, fileId, comment, pseudonym, profilePhoto, role, roleId, authorId, date }: FilesCommentsType,
            index,
          ) => (
            <DCProvider key={index}>
              <FileComment
                id={id}
                fileId={fileId}
                comment={comment}
                pseudonym={pseudonym}
                profilePhoto={profilePhoto}
                role={role}
                roleId={roleId}
                authorId={authorId}
                date={date}
              />
            </DCProvider>
          ),
        )
      ) : (
        <p className={styles.noComments}>{noComments}</p>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElements={nextComments} />}
    </>
  );
}