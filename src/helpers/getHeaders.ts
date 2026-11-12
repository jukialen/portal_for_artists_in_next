'use server';
import { headers } from 'next/headers';

export const getTraceId = async () => {
  const headersList = await headers();
  const traceparent = headersList.get('traceparent');
  return traceparent?.split('-')[1] ?? 'no-trace';
};
