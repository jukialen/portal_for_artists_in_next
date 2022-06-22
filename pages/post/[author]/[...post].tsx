import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

export default function Post() {
  const [container, setContainer] = useState<JSX.Element | undefined>(undefined);
  const [tag, setTag] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [url, setUrl] = useState('/#');
  
  const { asPath } = useRouter();
  
  useMemo(() => {
    const split = asPath.split('/');
    setPseudonym(decodeURIComponent(split[2]));
    setUrl(`https://firebasestorage.googleapis.com/${split[5]}/${split[6]}/${split[7]}/${split[8]}/${split[9]}`);
    setTag(split[split.length - 1]);
  }, [asPath]);
  
  const photosPost = (<Article link={`${url}`} tag={tag} authorName={pseudonym} unopt />);
  const animationPost = (<Article link={url} tag={tag} authorName={pseudonym} unopt />);
  const videoPost = (<Videos link={url} tag={tag} authorName={pseudonym} />);
  
  useEffect(() => {
    switch (tag) {
      case 'アニメーション':
      case 'Animations':
      case 'Animacje':
        setContainer(animationPost!);
        break;
      case 'Filmy':
      case 'Videos':
      case '映画':
        setContainer(videoPost!);
        break;
      default:
        setContainer(photosPost!);
        break;
    }
  }, [asPath]);
  
  return (
    <>
      <HeadCom path={asPath} content={`${pseudonym} user post page`} />
      
      <article id='user__gallery__in__account' className='user__gallery__in__account'>
        <Wrapper>{container}</Wrapper>
      </article>
    </>
  );
}