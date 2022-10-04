import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getDocs } from 'firebase/firestore';

import { commentsFiles } from 'references/referencesFirebase';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

export default function Post() {
  const [container, setContainer] = useState<JSX.Element | undefined>(undefined);
  const [tag, setTag] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [uid, setUid] = useState('');
  const [subCollection, setSubCollection] = useState('');
  const [description, setDescription] = useState('');
  const [idPost, setIdPost] = useState('');
  const [linkToImg, setLinkToImg] = useState('/#');

  const { asPath } = useRouter();

  const downloadUrl = async () => {
    const querySnapshot = await getDocs(commentsFiles(subCollection, description));

    querySnapshot.forEach((doc) => setLinkToImg(doc.data().fileUrl));
  };

  useMemo(() => {
    const split = asPath.split('/');

    setPseudonym(decodeURIComponent(split[2]));
    setDescription(split[3]);
    setUid(split[4]);
    setSubCollection(split[5]);
    setIdPost(split[6]);

    !!(subCollection && description) && downloadUrl();

    setTag(split[split.length - 1]);
  }, [asPath, idPost, linkToImg]);

  const photosPost = (
    <Article
      link={linkToImg}
      tag={tag}
      authorName={pseudonym}
      unopt
      description={description}
      subCollection={subCollection}
      uid={uid}
      idPost={idPost}
    />
  );

  const animationPost = (
    <Article
      link={linkToImg}
      tag={tag}
      authorName={pseudonym}
      unopt
      description={description}
      subCollection={subCollection}
      uid={uid}
      idPost={idPost}
    />
  );

  const videoPost = (
    <Videos
      link={linkToImg}
      tag={tag}
      authorName={pseudonym}
      description={description}
      subCollection={subCollection}
      uid={uid}
      idPost={idPost}
    />
  );

  useEffect(() => {
    switch (tag) {
      case 'animations':
        setContainer(animationPost!);
        break;
      case 'videos':
        setContainer(videoPost!);
        break;
      default:
        setContainer(photosPost!);
        break;
    }
  }, [asPath, linkToImg]);

  return (
    <>
      <HeadCom path={asPath} content={`${pseudonym} user post page`} />

      <Wrapper>{container}</Wrapper>
    </>
  );
}
