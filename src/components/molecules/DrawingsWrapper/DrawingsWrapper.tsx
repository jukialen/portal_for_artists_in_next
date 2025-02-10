'use client';

import { useState } from 'react';

import { getDate } from 'helpers/getDate';
import { getFileRoleId } from 'utils/roles';
import { createClient } from 'utils/supabase/clientCSR';

import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { AnothersWrapperContent } from 'components/Views/AnothersWrapperContent/AnothersWrapperContent';

type DrawingsWrapperType = {
  locale: LangType;
  pid: Tags;
  pseudonym: string;
  profilePhoto: string;
  dataDateObject: DateObjectType;
  noDrawings: string;
  filesDrawings: FileType[];
};

export const DrawingsWrapper = ({
  locale,
  pid,
  pseudonym,
  profilePhoto,
  dataDateObject,
  noDrawings,
  filesDrawings,
}: DrawingsWrapperType) => {
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

      setLastVisible(nextArray[nextArray.length - 1].fileId!);
      const newArray = filesDrawings!.concat(...nextArray);
      if (nextArray.length === maxItems) {
        setUserDrawings(newArray);
        setI(++i);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {!!userDrawings && userDrawings.length > 0 ? (
        <ClientPortalWrapper>
          <AnothersWrapperContent
            loadingFiles={loadingFiles}
            userFiles={userDrawings}
            pseudonym={pseudonym}
            profilePhoto={profilePhoto}
          />
        </ClientPortalWrapper>
      ) : (
        <ZeroFiles text={noDrawings} />
      )}

      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && (
        <MoreButton nextElements={nextElements} />
      )}
    </>
  );
};
