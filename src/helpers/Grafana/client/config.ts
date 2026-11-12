'use client';

import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import type { Faro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { faroHost } from 'constants/links';

let faroInstance: Faro | null = null;

export const faroConfig = (): Faro | null => {
  if (typeof window === 'undefined') return null; // guard SSR

  if (faroInstance) {
    return faroInstance;
  }

  faroInstance = initializeFaro({
    url: faroHost,
    app: {
      name: 'Pfartists',
      version: '1.0.0',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      namespace: 'Pfartists-frontend',
    },
    sessionTracking: {
      samplingRate: 1,
      persistent: true,
      session: {
        attributes: {
          site: 'Pfartists-frontend',
          service: 'Pfartists-frontend',
        },
      },
    },
    instrumentations: [
      // Mandatory, omits default instrumentations otherwise.
      ...getWebInstrumentations(),

      // Tracing package to get end-to-end visibility for HTTP requests.
      new TracingInstrumentation(),
    ],
  });

  return faroInstance;
};

