import { useRouter } from 'next/router';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { photosCollectionRef, animationsCollectionRef, videosCollectionRef } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

import styles from './index.module.scss';
import { Article } from 'components/molecules/Article/Article';
import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';
import { Videos } from '../../components/molecules/Videos/Videos';

export default function Application() {
  const { asPath } = useRouter();
  
  const data = useHookSWR();
  
  const loading = useCurrentUser('/');
  
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={asPath} content='Main site for logged in users.' />
  
      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='photos'
          refFile={photosCollectionRef()}
        />
        
      </AppWrapper>
      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        <Article
          imgLink='/#'
          subCollection='animations'
          refFile={animationsCollectionRef()}
        />
        
      </AppWrapper>
      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />
        <Videos
          link='/#'
          refFile={videosCollectionRef()}
        />

      </AppWrapper>
    </section>
  ) : null;
};