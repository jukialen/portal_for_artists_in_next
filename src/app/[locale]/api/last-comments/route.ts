import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale } from 'locales/server';

import { backUrl, cloudFrontUrl } from 'constants/links';
import { Database } from 'types/database.types';
import { LastCommentType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('commentId');
  const where = searchParams.get('where');
  const maxItems = searchParams.get('maxItems');
  const cursor = searchParams.get('lastVisible');
  let _error;
  const comments: LastCommentType[] = [];

  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookies() });
  const dataDateObject = await dateData();
  const locale = getCurrentLocale();
  const userData = await getUserData();

  const paramsAdRole = (adModRoleId: string) =>
    encodeURI(
      JSON.stringify({
        roleId: adModRoleId,
      }),
    );

  if (!cursor) {
    const { data, error } = await supabase
      .from('LastComments')
      .select(
        'lastCommentId, lastComment, subCommentId, authorId, adModRoleId, createdAt, updatedAt, Users (pseudonym, profilePhoto), Roles (role)',
      )
      .eq(where!, commentId!)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems!));

    for (const _last of data!) {
      const { lastCommentId, lastComment, subCommentId, Users, adModRoleId, authorId, createdAt, updatedAt, Roles } =
        _last;
      const groupRole: Database['public']['Enums']['Role'] = await fetch(`${backUrl}/roles?${() => paramsAdRole(adModRoleId!)}`, {
        method: 'GET',
      }).then((data) => data.json());

      comments.push({
        role: Roles?.role!,
        groupRole,
        lastComment,
        lastCommentId,
        subCommentId,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: `https://${cloudFrontUrl}/${Users?.profilePhoto!}`,
        authorId,
        date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        profilePhoto: userData?.profilePhoto,
      });
    }
    _error = error;
  } else {
    const { data, error } = await supabase
      .from('LastComments')
      .select(
        'lastCommentId, lastComment, subCommentId, authorId, adModRoleId, createdAt, updatedAt, Users (pseudonym, profilePhoto), Roles (role)',
      )
      .eq(where!, commentId!)
      .order('createdAt', { ascending: false })
      .lt('createdAt', cursor)
      .limit(parseInt(maxItems!));

    for (const _last of data!) {
      const { lastCommentId, lastComment, subCommentId, Users, adModRoleId, authorId, createdAt, updatedAt, Roles } =
        _last;
      const groupRole: Database['public']['Enums']['Role'] = await fetch(`${backUrl}/roles?${() => paramsAdRole(adModRoleId!)}`, {
        method: 'GET',
      }).then((data) => data.json());

      comments.push({
        role: Roles?.role!,
        groupRole,
        lastComment,
        lastCommentId,
        subCommentId,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: `https://${cloudFrontUrl}/${Users?.profilePhoto!}`,
        authorId,
        date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        profilePhoto: userData?.profilePhoto
      });
    }

    _error = error;
  }
  if (_error) throw _error;
  return NextResponse.json({ data: comments });
}

export async function POST(request: NextRequest) {
  const { subCommentId, lastComment, fileCommentId, fileId, postId, adModRoleId, roleId, authorId } =
    await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookies() });

  const { data } = await supabase
    .from('LastComments')
    .insert([{ subCommentId, lastComment, fileCommentId, fileId, postId, adModRoleId, roleId, authorId }])
    .select();
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');
  const commentId = searchParams.get('lastCommentId');

  const params = encodeURI(JSON.stringify({ roleId }));
  const data = await fetch(`${backUrl}/api/roles/${params}`, {
    method: 'GET',
  }).then((r) => r.json());

  if (!!(data?.role === 'ADMIN' || 'MODERATOR' || 'AUTHOR')) {
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase.from('LastComments').delete().eq('lastCommentId', commentId);

    if (!!error) throw Error(error.message);
  } else {
    throw Error("You don't have permission to delete this comment.");
  }
}
