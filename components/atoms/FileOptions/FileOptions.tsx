import styles from './FileOptions.module.scss';
import { IconButton } from '@chakra-ui/react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Comments } from '../Comments/Comments';
import {
  LineShareButton,
  LineIcon,
  WhatsappShareButton,
  WhatsappIcon,
  WeiboShareButton,
  WeiboIcon,
} from 'next-share';

import { FileContainerType } from 'types/global.types';
import { useRouter } from 'next/router';
import { RWebShare } from 'react-web-share';

export const FileOptions = ({ authorName, link, tag }: FileContainerType) => {
  const [share, setShare] = useState(false);
  const [open, setOpen] = useState(false);
  
  const { locale } = useRouter();
  
  const showShare = () => setShare(!share);
  const showOpenComments = () => setOpen(!open);
  
  const icon = 30;
  const linkShare = `${process.env.NEXT_PUBLIC_PAGE}/post/${authorName}/${link}/${tag}`
  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`${locale === 'en' ? '/' : `/${locale}/`}user/${authorName}`}>
            <a>
              {authorName}
            </a>
          </Link>
        </div>
      
        <div className={styles.share}>
          <IconButton
            icon={<AiOutlineShareAlt />}
            variant='solid'
            colorScheme='teal'
            aria-label='share button'
            border='1px solid transparent'
            fontSize='20px'
            cursor='pointer'
            onClick={showShare}
          />
        
          <div className={`${styles.share__options} ${share ? styles.share__options__active : ''}`}>
            <div className={styles.icon}>
              <LineShareButton url={linkShare}>
                <LineIcon size={icon} />
              </LineShareButton>
            </div>
            <div className={styles.icon}>
              <WhatsappShareButton url={linkShare} windowHeight={500}>
                <WhatsappIcon size={icon}  />
              </WhatsappShareButton>
            </div>
            <div className={styles.icon}>
              <WeiboShareButton url={linkShare}>
                <WeiboIcon size={icon} round />
              </WeiboShareButton>
            </div>
            <div className={styles.icon}>
              <RWebShare
                data={{ url: linkShare }}
                onClick={() => console.log('shared successfully!')}
              >
                <Image src='/copy.svg' width={icon} height={icon} aria-label='copy icon' />
              </RWebShare>
            </div>
          </div>
      
        </div>
      </div>
      <button className={styles.comments} onClick={showOpenComments}>Show comments</button>
      { open && <Comments /> }
    </div>

  )
}