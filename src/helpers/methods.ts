import { cookies } from 'next/headers';

type QueryParamsType = {
  where: { AND: { tags: string }[] } | { tags: string } | object;
  orderBy: { createdAt: string } | object;
  limit: string;
};

export const get = async (url: string, params: { queryData: QueryParamsType }) => {
  const queryParams = new URLSearchParams();
  
  queryParams.set('queryData', JSON.stringify(params.queryData));
  
  const testParams = JSON.stringify(params);
  
  const res = await fetch(new URL(`${url}/?${testParams})}`), {
    headers: { Cookie: cookies.toString() },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
 
};

export const getOnes = async (url: string) => {
  const res = await fetch(url, { headers: { Cookie: cookies().toString() } });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
};
