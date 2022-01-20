import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  description: string;
}

export const GalleryAccount: FC<FileType> = ({ data }: any) => {
  const user = auth.currentUser;
  const userFilesRef = ref(storage, `${user?.uid}`);
  const maxItems: number = 20;
  
  const { isMode } = useContext(ModeContext);
  const { asPath } = useRouter();
  const [userPhotos, setUserPhotos] = useState<[]>([]);
  
  const downloadFiles = async () => {
    const firstPage = await list(userFilesRef, { maxResults: maxItems });
    let images: [] = [];
    
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
  
  const itemRender = (current: number, type: string, originalElement: any) => {
    
    type === 'prev' && <a href={asPath}>Previous</a>;
    type === 'next' && <a href={asPath} onClick={() => nextFiles()}>Next</a>;
    return originalElement;
  };
  
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <FilesUpload />
      
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>
      
      <div className={styles.user__photos}>
        {!userPhotos && <ZeroFiles text='No your photos, animations and films.' />}
        {!!userPhotos && userPhotos.map(({ fileUrl, description }: FileType) => <Photos
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
