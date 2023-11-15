import { DateObjectType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

export const useDateData = (): DateObjectType => {
  const data = useHookSWR();

  return {
    second: data?.Date?.second,
    minute: data?.Date?.minute,
    hour: data?.Date?.hour,
    day: data?.Date?.day,
    yearDateSeparator: data?.Date?.yearDateSeparator,
  };
};
