import { Json } from 'types/database.types';

import SwaggerUIClient from './swagger-client';

import styles from './page.module.scss';

const fetchSpecs = async (): Promise<Json | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PAGE}/api/docs`, { next: { revalidate: 3600 } });

    if (!res.ok) throw new Error('Failed to fetch API specifications');

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch API specifications:', error);
    return null;
  }
};

export default async function ApiDocs() {
  const specs = await fetchSpecs();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Portal for Artists - API Documentation</h1>
      {specs ? (
        <SwaggerUIClient spec={specs} />
      ) : (
        <p className={styles.errorMessage}>Failed to load API documentation</p>
      )}
    </div>
  );
}
