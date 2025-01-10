import { cloudFrontUrl } from "constants/links";
import { selectFiles } from "constants/selects";
import { DateObjectType, FileType, LangType } from "types/global.types";
import { getDate } from "helpers/getDate";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../types/database.types";
import { cookies } from "next/headers";

const  supabase = createServerComponentClient<Database>({ cookies });

export const graphics = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
  try {
    const filesArray: FileType[] = [];
    
    const { data } = await supabase
    .from('files')
    .select(selectFiles)
    .eq('authorId', authorId)
    .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
    .order('createdAt', { ascending: false })
    .limit(maxItems);
    
    if (data?.length === 0) return filesArray;
    
    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;
      
      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt,
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
export const animations = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
  try {
    const filesArray: FileType[] = [];
    
    const { data } = await supabase
    .from('files')
    .select(selectFiles)
    .eq('authorId', authorId)
    .eq('tags', 'animations')
    .order('createdAt', { ascending: false })
    .limit(maxItems);
    
    if (data?.length === 0) return filesArray;
    
    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;
      
      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt,
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
export const videos = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
  try {
    const filesArray: FileType[] = [];
    
    const { data } = await supabase
    .from('files')
    .select(selectFiles)
    .eq('authorId', authorId)
    .eq('tags', 'videos')
    .order('createdAt', { ascending: false })
    .limit(maxItems);
    
    if (data?.length === 0) return filesArray;
    
    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;
      
      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt,
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
