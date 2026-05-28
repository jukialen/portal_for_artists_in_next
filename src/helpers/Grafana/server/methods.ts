import { lokiAuth } from './config';
import { lokiHost } from 'constants/links';

type LogType = 'info' | 'error' | 'warn';

export const sendLokiLog = async (message: string, traceId: string, type: LogType = 'info') => {
  try {
    const logBody = JSON.stringify({ message, trace_id: traceId ?? 'no-trace', level: type });
    const timestamp = (Date.now() * 1_000_000).toString();

    const res = await fetch(`${lokiHost}/loki/api/v1/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${lokiAuth}` },
      body: JSON.stringify({
        streams: [
          {
            stream: { app: 'Pfartists', service: 'Pfartists-backend', level: type },
            values: [[timestamp, logBody]],
          },
        ],
      }),
    });

    console.log('res', res);
  } catch (err) {
    console.error('[Logger] Loki error:', err);
  }
};
