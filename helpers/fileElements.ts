import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

import { FileType } from 'types/global.types';

export const filesElements = (filesArray: FileType[], document: QueryDocumentSnapshot, docSnap: DocumentSnapshot) => {
  return filesArray.push({
    fileUrl: document.data().fileUrl,
    time: document.data().timeCreated,
    tags: document.data().tag,
    pseudonym: docSnap.data()!.pseudonym,
    description: document.data().description
  });
}
