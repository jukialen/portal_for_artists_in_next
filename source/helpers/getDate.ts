import { DateObjectType } from 'source/types/global.types';

export const getDate = (locale: string, dateField: string, dataDateObject: DateObjectType) => {
  const today = new Date(parseInt(dateField));

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

  const simpleSeconds = `${curretSeconds - second}${dataDateObject.second}`;
  const simpleMinutes = `${currentMinutes - minute}${dataDateObject.minute}`;
  const simpleHours = `${currentHour - hour}${dataDateObject.hour}`;
  const simpleDays = `${currentDay - day}${dataDateObject.day}`;

  const minutes = `${minute < 10 ? '0' : ''}${minute}`;
  const hours = `${hour < 10 ? '0' : ''}${hour}`;
  const days = `${day < 10 ? '0' : ''}${day}`;
  const months = `${month < 10 ? '0' : ''}${month}`;
  const years = `${year !== currentYear ? year : ''}`;

  const simpleYearSeparator = `${year !== currentYear ? dataDateObject.yearDateSeparator : ''}`;
  const simpleYears = locale === 'jp' ? `${years}${simpleYearSeparator}` : `${simpleYearSeparator}${years}`;

  const jpTimes = `${hours}時${minutes}${dataDateObject.minute}`;
  const jpDate = `${simpleYears}${months}月${days}${dataDateObject.day}`;

  const times = `${hours}:${minutes}`;
  const date = `${days}.${months}${simpleYears}`;

  if (month === currentMonth && year === currentYear) {
    if (day === currentDay) {
      if (hour === currentHour) {
        if (minute === currentMinutes) {
          return simpleSeconds;
        } else {
          return simpleMinutes;
        }
      } else {
        return simpleHours;
      }
    } else {
      return simpleDays;
    }
  } else {
    return locale === 'jp' ? `${jpDate} ${jpTimes}` : `${date} ${times}`;
  }
};
