import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { DataType } from 'types/global.types';

export const useHookSWR = () => {
  const { locale } = useRouter();

  const fetcher = (args: string): DataType => axios.get(args).then((res) => res.data);
  const { data } = useSWR(`/languages/${locale}.json`, fetcher);

  return data;
};
