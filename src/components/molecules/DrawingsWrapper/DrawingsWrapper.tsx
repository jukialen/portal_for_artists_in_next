'use client';

import { ReactNode, useState } from 'react';

import { getDate } from 'helpers/getDate';
import { getFileRoleId } from 'utils/roles';
import { createClient } from 'utils/supabase/clientCSR';

import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { getMoreRenderedContent } from '../../../app/[locale]/actions';
import { NextResponse } from 'next/server';

type DrawingsWrapperType = {
  locale: LangType;
  pid: Tags;
  dataDateObject: DateObjectType;
  filesDrawings: FileType[];
  initialRenderedContentAction: () => ReactNode;
};

export const DrawingsWrapper = ({
  locale,
  pid,
  dataDateObject,
  filesDrawings,
  initialRenderedContentAction,
}: DrawingsWrapperType) => {
  const [renderedContent, setRenderedContent] = useState(initialRenderedContentAction);
  const [userDrawings, setUserDrawings] = useState<FileType[]>(filesDrawings);
  const [lastVisible, setLastVisible] = useState(
    userDrawings.length > 0 ? userDrawings[userDrawings.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const maxItems = 30;

  const supabase = createClient();

  !!userDrawings &&
    userDrawings.length === maxItems &&
    setLastVisible(userDrawings[userDrawings.length - 1].createdAt!);

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const nextArray: FileType[] = [];

      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('tags', pid)
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return nextArray;

      for (const file of data) {
        const { fileId, name, shortDescription, Users, tags, fileUrl, authorId, createdAt, updatedAt } = file;

        const roleId = await getFileRoleId(fileId, authorId!);

        if (roleId === 'no id') return;

        nextArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl,
          authorId: authorId!,
          tags,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          roleId,
        });
      }

      const newArray = filesDrawings!.concat(...nextArray);

      setRenderedContent(await getMoreRenderedContent({ files: newArray, noEls: 1 }));
      setUserDrawings(newArray);
      if (nextArray.length === maxItems) {
        setLastVisible(nextArray[nextArray.length - 1].fileId!);
        setI(++i);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {renderedContent}
      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && (
        <MoreButton nextElements={nextElements} />
      )}
    </>
  );
};
