'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DateObjectType, FileType, LangType, Tags } from "types/global.types";

import { getDate } from 'helpers/getDate';

import { selectFiles } from 'constants/selects';
import { Database } from 'types/database.types';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';
import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';

type DrawingsWrapperType = {
  locale: LangType;
  pid: Tags;
  pseudonym: string;
  dataDateObject: DateObjectType;
  noDrawings: string;
  filesDrawings: FileType[] | undefined;
};

export const DrawingsWrapper = ({
  locale,
  pid,
  pseudonym,
  dataDateObject,
  noDrawings,
  filesDrawings,
}: DrawingsWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[] | undefined>(filesDrawings);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  let [i, setI] = useState(1);

  const maxItems = 30;

  const supabase = createClientComponentClient<Database>();

  !!userDrawings && userDrawings.length === maxItems && setLastVisible(userDrawings[userDrawings.length - 1].fileId!);

  const nextElements = async () => {
    try {
      const filesArray: FileType[] = [];

      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('tags', pid)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data) {
        const { fileId, name, shortDescription, Users, tags, fileUrl, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl,
          authorId: authorId!,
          tags,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setLastVisible(filesArray[filesArray.length - 1].fileId!);
      const newArray = filesDrawings!.concat(...filesArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {!!userDrawings && userDrawings.length > 0 ? (
        userDrawings.map(
          (
            { fileId, name, fileUrl, shortDescription, tags, authorName, authorProfilePhoto, authorId, time }: FileType,
            index,
          ) => (
            <ClientPortalWrapper key={index}>
              <Article
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={authorName!}
                authorId={authorId}
                authorBool={authorName === pseudonym!}
                profilePhoto={authorProfilePhoto!}
                time={time}
              />
            </ClientPortalWrapper>
          ),
        )
      ) : (
        <ZeroFiles text={noDrawings} />
      )}

      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && (
        <MoreButton nextElements={nextElements} />
      )}
    </>
  );
};
