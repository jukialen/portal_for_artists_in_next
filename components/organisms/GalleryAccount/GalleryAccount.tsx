import { ReactElement, useContext, useEffect, useState } from 'react';
import { getDownloadURL, getMetadata, list, ref } from 'firebase/storage';
import { auth, storage } from '../../../firebase';
import { Pagination } from 'antd';

import { Photos } from 'components/atoms/Photos/Photos';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

import { ModeContext } from 'providers/ModeProvider';

import styles from './GalleryAccount.module.scss';

type FileType = {
  fileUrl: string;
  description: string | undefined;
}

export const GalleryAccount = ({ data }: any) => {
  const user = auth.currentUser;
  const userFilesRef = ref(storage, `${user?.uid}`);
  const maxItems: number = 20;
  
  const { isMode } = useContext(ModeContext);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  
  const downloadFiles = async () => {
    const firstPage = await list(userFilesRef, { maxResults: maxItems });
    let images: FileType[] = [];
    
    try {
      firstPage.items.map(async (firstPage) => {
        const photoUrl = await getDownloadURL(firstPage);
        const metadata = await getMetadata(firstPage);
        
        images.push({
          fileUrl: photoUrl,
          description: metadata.customMetadata?.description
        });
        
        setUserPhotos(images);
      });
    } catch (e) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    downloadFiles();
  }, []);
  
  const nextFiles = async () => {
    const firstPage = await list(userFilesRef, { maxResults: maxItems });
    if (!!firstPage.nextPageToken) {
      await list(userFilesRef, {
        maxResults: maxItems,
        pageToken: firstPage.nextPageToken,
      });
    }
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
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <FilesUpload />
      
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>
      
      <div className={styles.user__photos}>
        {!userPhotos && <ZeroFiles text='No your photos, animations and films.' />}
        {!!userPhotos && userPhotos.map(({ fileUrl, description }) => <Photos
          link={fileUrl}
          description={description}
          key={description}
        />)}
      </div>
      <Pagination
        className={`pagination ${isMode ? 'pagination-dark' : ''}`}
        defaultCurrent={1}
        defaultPageSize={maxItems}
        showSizeChanger={false}
        total={userPhotos.length}
        simple
        hideOnSinglePage
        itemRender={itemRender}
      />
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedFiles}</em>
      
      <div className={styles.like__photos}>
        <ZeroFiles text='No liked photos, animations and films.' />
      </div>
    </article>
  );
};
