import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { auth, storage } from '../../../firebase';

import { Photos } from 'components/atoms/Photos/Photos';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

import styles from './GalleryAccount.module.scss';
import { useEffect, useState } from 'react';

export const GalleryAccount = ({ data }: any ) => {
  const user = auth.currentUser;
  
  const [ userPhotos, setUserPhotos ] = useState('');
  
  const userFilesRef = ref(storage, `${user?.uid}`);
  
  // useEffect(() => {
  //   let images: string[] = [];
  //   listAll(userFilesRef)
  //   .then( async (res) => {
  //     await res.prefixes.forEach((folderRef) => {
  //       console.log(folderRef);
  //     });
  //     await res.items.forEach( (itemRef) => {
  //       // All the items under listRef.
  //       console.log(itemRef);
  //       console.log(itemRef.fullPath);
  //       const photoUrl = getDownloadURL(itemRef);
  //       images.push(photoUrl);
  //       setUserPhotos(images);
  //       console.log(userPhotos[0])
  //       console.log(userPhotos)
  //
  //     });
  //   }).catch((error) => {
  //     console.log(error);
  //     // Uh-oh, an error occurred!
  //   });
  // }, [])
  
  useEffect( async() => {
      let images: string[] = [];
  
    try {
      const res = listAll(userFilesRef);
      console.log('res', res)
      await res.prefixes.forEach((folderRef) => {
        console.log(folderRef);
      });
      // console.log(res.PromiseAll)
      await res.items.forEach(async(itemRef) => {
        // All the items under listRef.
        console.log(itemRef);
        console.log(itemRef.fullPath);
        const photoUrl = await getDownloadURL(itemRef);
        await images.push(photoUrl);
        setUserPhotos(images);
        console.log(userPhotos[0])
        console.log(userPhotos)
    
      });
    } catch (e) {
    
    }
  }, [])
  
  // listAll(userFilesRef)
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>
      
      <FilesUpload />
    
      <div className={styles.user__photos}>
        {/*{userPhotos.forEach(e => <Photos alternativeText={e} link={e} />)}*/}
        <Photos />
        <Photos />
        <Photos />
        {/*<Photos />*/}
        {/*<Photos />*/}
      </div>
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedFiles}</em>
      
      <div className={styles.like__photos}>
        {/*<Photos />*/}
        {/*<Photos />*/}
        {/*<Photos />*/}
        {/*<Photos />*/}
        {/*<Photos />*/}
        {/*<Photos />*/}
      </div>
    </article>
  );
};
