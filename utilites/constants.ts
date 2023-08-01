import { DateObjectType } from 'types/global.types';
import { useHookSWR } from 'hooks/useHookSWR';

export const cloudFrontUrl = `${process.env.NEXT_PUBLIC_S3_URL}`;
export const backUrl = `${process.env.NEXT_PUBLIC_BACK_URL}`;
