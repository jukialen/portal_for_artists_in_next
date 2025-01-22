import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';

import { Database } from 'types/database.types';
import { CommentType, LangType } from 'types/global.types';

const supabase = createServerComponentClient<Database>({ cookies });

export const firstComments = async (locale: LangType, postId: string, maxItems: number) => {
  const commentArray: CommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('Comments')
      .select('commentId, comment, roleId, adModRoleId, authorId, createdAt, updatedAt')
      .eq('postId', postId)
      .order('postId', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return;
    }
    for (const first of data!) {
      const { commentId, comment, roleId, authorId, adModRoleId, createdAt, updatedAt } = first;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', first.authorId)
        .limit(1)
        .single();

      const { data: r, error: e } = await supabase
        .from('Roles')
        .select('role')
        .eq('id', first.roleId)
        .limit(1)
        .single();
      if (!!er || !!e) {
        console.error(er || e);
        return;
      }

      commentArray.push({
        commentId,
        comment,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role: r!.role,
        roleId,
        authorId,
        groupRole: r!.role,
        adModRoleId,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
  }
};

export const againComments = async (locale: LangType, postId: string, maxItems: number) => {
  const commentArray: CommentType[] = [];

  try {
    const { data, error } = await supabase
      .from('Comments')
      .select('commentId, comment, roleId, adModRoleId, authorId, createdAt, updatedAt')
      .gt('postId', postId)
      .order('postId', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) {
      console.error(error);
      return;
    }
    for (const first of data!) {
      const { commentId, comment, roleId, authorId, adModRoleId, createdAt, updatedAt } = first;
      const { data: d, error: er } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto')
        .eq('id', first.authorId)
        .limit(1)
        .single();

      const { data: r, error: e } = await supabase
        .from('Roles')
        .select('role')
        .eq('id', first.roleId)
        .limit(1)
        .single();
      if (!!er || !!e) {
        console.error(er || e);
        return;
      }

      commentArray.push({
        commentId,
        comment,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role: r!.role,
        roleId,
        authorId,
        groupRole: r!.role,
        adModRoleId,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }

    return commentArray;
  } catch (e) {
    console.error(e);
  }
};
