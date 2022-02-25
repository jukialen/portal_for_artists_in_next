import { getDocs, Query, query, startAfter } from 'firebase/firestore';
import { ReactElement } from 'react';

export const pagination = (nextPage: Query) => {
  const nextFiles = async () => {
    const querySnapshot = await getDocs(nextPage);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return query(nextPage, startAfter(lastVisible))
  };
  
  const itemRender = (current: number, type: string, originalElement: ReactElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    
    if (type === 'next') {
      return <a onClick={() => nextFiles()}>Next</a>;
    }
    
    return originalElement;
  };
  
  return itemRender
}