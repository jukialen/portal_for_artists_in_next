import { Timestamp } from 'firebase/firestore';

export const getDate = (locale: string, dateField: Timestamp) => {
  const today = new Date();
  
  const hour = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCHours();
  const minutes = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCMinutes();
  const day = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCDay()
  const month = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCMonth() + 1;
  const year = new Timestamp(dateField.seconds, dateField.nanoseconds).toDate().getUTCFullYear();
  
  const jpHours = `${hour >= 12 ? '午後' : '午前'}${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`
  const jpDate = `${year !== today.getUTCFullYear() ? year : ''}${year !== today.getUTCFullYear() ? '年' : ''}${month < 10 ? '0' : ''}${month}月${day}日`
  
  const hours = `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
  const date = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}${year !== today.getUTCFullYear() ? '/' : ''}${year !== today.getUTCFullYear() ? year : ''}`;
  
  return locale === 'jp' ? `${jpHours} ${jpDate}` : `${date} ${hours}`;
};
