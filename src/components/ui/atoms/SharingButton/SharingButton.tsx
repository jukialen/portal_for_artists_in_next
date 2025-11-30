'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Tags } from 'types/global.types';

import styles from './SharingButton.module.scss';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { LineIcon, LineShareButton, WeiboIcon, WeiboShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import { RWebShare } from 'react-web-share';

type SharingType = {
  shareUrl: string;
  authorName: string;
  tags?: Tags;
  name?: string;
};
export const SharingButton = ({ shareUrl, authorName, tags, name }: SharingType) => {
  const [share, setShare] = useState(false);

  const showShare = () => setShare(!share);

  const titleShare = !!tags
    ? `Share ${authorName}'s post from ${tags} category.`
    : `Share ${authorName}'s post from ${name} group.`;

  return (
    <div className={styles.share}>
      <button className={styles.sharButton} aria-label="share button" onClick={showShare}>
        <AiOutlineShareAlt />
      </button>

      <div className={`${styles.share__options} ${share ? styles.share__options__active : ''}`}>
        <LineShareButton url={shareUrl} title={titleShare}>
          <LineIcon className={styles.icon} />
        </LineShareButton>

        <WhatsappShareButton url={shareUrl} title={titleShare}>
          <WhatsappIcon className={styles.icon} />
        </WhatsappShareButton>

        <WeiboShareButton url={shareUrl} title={titleShare}>
          <WeiboIcon className={styles.icon} />
        </WeiboShareButton>
        <RWebShare data={{ url: shareUrl, title: titleShare }} onClick={() => console.log('shared successfully!')}>
          <button className={styles.more}>
            <Image src="/more.svg" fill alt="button for another options for sharing" />
          </button>
        </RWebShare>
      </div>
    </div>
  );
};
