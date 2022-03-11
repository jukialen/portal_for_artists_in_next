import Image from 'next/image';

import { ArticleImgType } from 'types/global.types';

import styles from './Article.module.scss';
import { IconButton } from '@chakra-ui/react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { useState } from 'react';

const icon = 30;

export const Article = ({ imgLink, imgDescription, authorName, unopt }: ArticleImgType) => {
  const [share, setShare] = useState(false);

  const showShare = () => setShare(!share);
  let img = 600;
 
  return (
    <div className={styles.article}>
      <Image className={styles.item} src={imgLink} alt={imgDescription} width={img} height={img} unoptimized={unopt} priority />
      <div className={styles.options}>
        <div className={styles.bottomPanel}>
          <div className={styles.author__name}>
            <a href='#'>{authorName}</a>
          </div>
          
          <div className={styles.share}>
              <IconButton
                icon={<AiOutlineShareAlt />}
                variant='solid'
                colorScheme='teal'
                aria-label='share button'
                // size='sm'
                border='1px solid transparent'
                fontSize='20px'
                cursor='pointer'
                onClick={showShare}
              />
            
            <div className={`${styles.share__options} ${share ? styles.share__options__active : ''}`}>
              <a
                href='https://www.facebook.com'
                className={styles.icon}
                target='_blank'
                rel='noreferrer'
              >
                <Image src='/facebook.svg' width={icon} height={icon} aria-label='facebook icon' />
              </a>
              <a
                href='https://www.twitter.com'
                className={styles.icon}
                target='_blank'
                rel='noreferrer'
              >
                <Image src='/twitter.svg' width={icon} height={icon} aria-label='twitter icon' />
              </a>
              <a
                href='https://www.discord.com'
                className={styles.icon}
                target='_blank'
                rel='noreferrer'
              >
                <Image src='/discord.svg' width={icon} height={icon} aria-label='discord icon' />
              </a>
              <a href='#' className={styles.icon}>
                <Image src='/copy.svg' width={icon} height={icon} aria-label='copy icon' />
              </a>
            </div>
          
          </div>
        </div>
        <button className={styles.comments}>Show comments</button>
      </div>
    </div>
  );
};
