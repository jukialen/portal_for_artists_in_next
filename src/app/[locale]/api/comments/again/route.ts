import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "types/database.types";
import { CommentType } from "types/global.types";

import { getCurrentLocale } from "locales/server";

import { dateData } from "helpers/dateData";
import { getDate } from "helpers/getDate";
import { likeList } from "utils/likes";
import { giveRole } from "utils/roles";
import { NextRequest } from "next/server";

const supabase = createServerComponentClient<Database>({ cookies });

const locale = getCurrentLocale();

export async function GET(req: NextRequest) {
  const commentArray: CommentType[] = [];
  
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  const maxItems = searchParams.get('maxItems');
  const groupsPostsRoleId = searchParams.get('groupsPostsRoleId');
  
  try {
    const { data, error } = await supabase
    .from('Comments')
    .select('*')
    .gt('postId', postId)
    .order('createdAt', { ascending: false })
    .limit(parseInt(maxItems!));
    
    if (!!error || data?.length === 0) {
      console.error(error);
      return commentArray;
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
        return commentArray;
      }
      
      commentArray.push({
        postId: postId!,
        commentId,
        content,
        authorName: d?.pseudonym!,
        authorProfilePhoto: d?.profilePhoto!,
        role,
        roleId: groupsPostsRoleId || roleId,
        authorId,
        likes: (await likeList(authorId, postId!))!.likes,
        liked: (await likeList(authorId, postId!))!.liked,
        date: getDate(locale!, updatedAt! || createdAt!, await dateData()),
      });
    }
    
    return commentArray;
  } catch (e) {
    console.error(e);
    return commentArray;
  }
}