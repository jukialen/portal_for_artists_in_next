import { useRouter } from "next/router";
import useSWR from "swr";

export const useHookSWR = () => {
  const { locale } = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${locale}.json`, fetcher)
  
  return data;
}