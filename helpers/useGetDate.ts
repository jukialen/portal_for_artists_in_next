import { useHookSWR } from 'hooks/useHookSWR';

export const useGetDate = (locale: string, dateField: number) => {
  const today = new Date(dateField);
  const data = useHookSWR();

  const second = today.getSeconds();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const currentTime = new Date();
  const curretSeconds = currentTime.getSeconds();
  const currentMinutes = currentTime.getMinutes();
  const currentHour = currentTime.getHours();
  const currentDay = currentTime.getDate();
  const currentMonth = currentTime.getMonth() + 1;
  const currentYear = currentTime.getFullYear();

  const simpleSeconds = `${curretSeconds - second}${data?.Date?.second}`;
  const simpleMinutes = `${currentMinutes - minute}${data?.Date?.minute}`;
  const simpleHours = `${currentHour - hour}${data?.Date?.hour}`;
  const simpleDays = `${currentDay - day}${data?.Date?.day}`;

  const minutes = `${minute < 10 ? '0' : ''}${minute}`;
  const hours = `${hour < 10 ? '0' : ''}${hour}`;
  const days = `${day < 10 ? '0' : ''}${day}`;
  const months = `${month < 10 ? '0' : ''}${month}`;
  const years = `${year !== currentYear ? year : ''}`;

  const simpleYearSeparator = `${year !== currentYear ? data?.Date?.yearDateSeparator : ''}`;
  const simpleYears = locale === 'jp' ? `${years}${simpleYearSeparator}` : `${simpleYearSeparator}${years}`;

  const jpTimes = `${hours}時${minutes}${data?.Date?.minute}`;
  const jpDate = `${simpleYears}${months}月${days}${data?.Date?.day}`;

  const times = `${hours}:${minutes}`;
  const date = `${days}.${months}${simpleYears}`;

  if (month === currentMonth && year === currentYear) {
    if (day === currentDay) {
      if (hour === currentHour) {
        if (minute === currentMinutes) {
          console.log(simpleSeconds);
          return simpleSeconds;
        } else {
          console.log(simpleMinutes);
          return simpleMinutes;
        }
      } else {
        console.log(simpleHours);
        return simpleHours;
      }
    } else {
      console.log(simpleDays);

      return simpleDays;
    }
  } else {
    return locale === 'jp' ? `${jpDate} ${jpTimes}` : `${date} ${times}`;
  }
};
