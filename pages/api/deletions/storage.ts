import { Firestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

const deleteQueryBatch = async (db: Firestore, query: { get: () => any; }, resolve: any ) => {
  try {
    const snapshot = await query.get();
    
    const batchSize = await snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      await resolve();
      console.log(resolve);
      return;
    }
    
    // Delete documents in a batch
    // @ts-ignore
    const batch = await db.batch();
    await snapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    await process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  } catch (e) {
    console.log(e);
  }
}

export const deleteCollection = async (collectionPath: string, batchSize: number) => {
  try {
    // @ts-ignore
    const collectionRef = await db.collection(collectionPath);
    const query = await collectionRef.orderBy('timeCreated').limit(batchSize);
    
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
  } catch (e) {
    console.log(e);
  }
};
