import { LogLevel } from '@grafana/faro-web-sdk';
import { faroConfig } from './config';

export const manualFaroLog = (message: string) => faroConfig()?.api.pushLog([message], { level: LogLevel.INFO });

export const errorFaroLog = (message: string, orderId: string) => {
  return faroConfig()?.api.pushError(new Error(message), { context: { orderId } });
};

export const actionFaroLog = (message: string, pathname: string, timeSpent: number) => {
  return faroConfig()?.api.pushEvent(message, {
    path: pathname,
    time_spent_ms: String(timeSpent),
  });
};

