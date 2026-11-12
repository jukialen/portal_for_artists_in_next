import { generateSW } from 'workbox-build';
import config from './workbox-config.js';

async function build() {
  try {
    const { count, size, warnings } = await generateSW(config);
    for (const warning of warnings) {
      console.warn('Warning:', warning);
    }
    console.log(`The service worker will precache ${count} URLs, totaling ${size} bytes.`);
  } catch (error) {
    console.error('Failed to generate service worker:', error);
    process.exit(1);
  }
}

build();
