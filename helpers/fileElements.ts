import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

import { FileType } from 'types/global.types';

export const filesElements = (filesArray: FileType[], document: QueryDocumentSnapshot, pseudonym: string) => {
  return filesArray.push({
    fileUrl: document.data().fileUrl,
    time: document.data().timeCreated,
    tags: document.data().tag,
    pseudonym: pseudonym,
    description: document.data().description
  });
}
