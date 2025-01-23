import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from "helpers/getUserData";
import { giveRole } from './roles';

import { Database } from 'types/database.types';
import { CommentType, DateObjectType, FilesCommentsType, LangType, NewCommentsType } from "types/global.types";

const supabase = createServerComponentClient<Database>({ cookies });
export const newComment = async (commentData: NewCommentsType) => {
  const { content, authorId, postId, roleId, fileId, fileCommentId, commentId, subCommentId } = commentData;

  try {
    
    if (!!postId) {
      const { error } = await supabase.from('Comments').insert([
        {
          content,
          authorId,
          postId: postId!,
          roleId,
        },
      ])
      
      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }
    
    if (!!fileId) {
      const { error } = await supabase.from('FilesComments').insert([
        {
          content: content!,
          authorId,
          fileId: fileId!,
          roleId,
        },
      ]);
      
      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }
    
    if (!!fileCommentId || !!commentId) {
      const { error } = await supabase.from('SubComments').insert([
        {
          content,
          authorId,
          commentId: commentId!,
          fileCommentId: fileCommentId!,
          roleId,
        },
      ]);
      
      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }
    
    if (!!subCommentId) {
      const { error } = await supabase.from('LastComments').insert([
        {
          content,
          authorId,
          subCommentId: subCommentId!,
          roleId,
        },
      ]);
      
      if (!!error) {
        console.error(error);
        return { role: null };
      }
      return await giveRole(roleId);
    }
  } catch (error) {
    console.error(error);
  }
};

export const firstComments = async (locale: LangType, postId: string, maxItems: number, groupsPostsRoleId: string) => {
  const commentArray: CommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('Comments')
      .select('*')
      .eq('postId', postId)
      .order('postId', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return;
    }
    for (const first of data!) {
      const { commentId, content, roleId, authorId, postId, createdAt, updatedAt } = first;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();

      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return;
      }

      commentArray.push({
        commentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        postId,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
  }
};

export const againComments = async (locale: LangType, postId: string, maxItems: number, groupsPostsRoleId: string) => {
  const commentArray: CommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('Comments')
      .select('*')
      .gt('postId', postId)
      .order('postId', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return;
    }
    for (const next of data!) {
      const { commentId, content, roleId, authorId, createdAt, updatedAt } = next;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', authorId)
        .limit(1)
        .single();
      
      const role = await giveRole(groupsPostsRoleId || roleId);
      if (!!er || role === undefined) {
        console.error(er || 'role is undefined');
        return;
      }

      commentArray.push({
        postId,
        commentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData())
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
  }
};

export const filesComments = async (fileId: string, locale: LangType, maxItems: number, dataDateObject: DateObjectType) => {
  const userData = await getUserData();
  
  const filesArray: FilesCommentsType[] = [];
  
  try {
    const { data, error } = await supabase
    .from('FilesComments')
    .select('id, fileId, content, roleId, Roles (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)')
    .eq('fileId', fileId)
    .order('createdAt', { ascending: false })
    .limit(maxItems);
    if (!data || data?.length === 0 || !!error) return filesArray;
    
    for (const first of data!) {
      const { id, fileId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = first;
      
      filesArray.push({
        fileCommentId: id,
        fileId,
        content,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: userData?.profilePhoto!,
        role: Roles?.role!,
        roleId,
        authorId,
        date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }
    
    return filesArray;
  } catch (error) {
    console.error(error);
    
    return filesArray;
  }
};

export const againFilesComments = async (fileId: string, locale: LangType, maxItems: number, dataDateObject: DateObjectType) => {
  const userData = await getUserData();
  
  const filesArray: FilesCommentsType[] = [];
  
  try {
    const { data, error } = await supabase
    .from('FilesComments')
    .select('id, fileId, content, roleId, Roles (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)')
    .gt('fileId', fileId)
    .order('createdAt', { ascending: false })
    .limit(maxItems);
    if (!data || data?.length === 0 || !!error) return filesArray;
    
    for (const again of data!) {
      const { id, fileId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = again;
      
      filesArray.push({
        fileCommentId: id,
        fileId,
        content,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: userData?.profilePhoto!,
        role: Roles?.role!,
        roleId,
        authorId,
        date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }
    
    return filesArray;
  } catch (error) {
    console.error(error);
    
    return filesArray;
  }
};
