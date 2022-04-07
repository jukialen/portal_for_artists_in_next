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
  
  const icon = 40;
  
  const titleShare = `Share ${authorName} user post from category ${tag}`;
  
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
              <LineShareButton url={linkShare} title={titleShare}>
                <LineIcon size={icon} borderRadius={20} />
              </LineShareButton>
            </div>
            <div className={styles.icon}>
              <WhatsappShareButton url={linkShare} title={titleShare}>
                <WhatsappIcon size={icon} borderRadius={20} />
              </WhatsappShareButton>
            </div>
            <div className={styles.icon}>
              <WeiboShareButton url={linkShare} title={titleShare}>
                <WeiboIcon size={icon} borderRadius={20} />
              </WeiboShareButton>
            </div>
            <div className={styles.icon}>
              <RWebShare
                data={{ url: linkShare, title: titleShare }}
                onClick={() => console.log('shared successfully!')}
              >
                <button className={styles.more}>
                  <Image src='/more.svg' layout='fill' alt='button for another options for sharing' />
                </button>
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