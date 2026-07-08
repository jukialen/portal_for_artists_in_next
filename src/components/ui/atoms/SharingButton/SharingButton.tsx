'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Tags } from 'types/global.types';

import styles from './SharingButton.module.css';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { LineIcon, LineShareButton, WeiboIcon, WeiboShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import { RWebShare } from 'react-web-share';
import { createClient } from '../../../../utils/supabase/clientCSR';

type SharingType = {
  shareUrl: string;
  authorName: string;
  tags?: Tags;
  name?: string;
  shared: number;
  postId?: string;
};

export const SharingButton = ({ shareUrl, authorName, tags, name, shared, postId }: SharingType) => {
  const [share, setShare] = useState(false);
  const [shareCount, setShareCount] = useState(shared);

  const showShare = () => setShare(!share);
  const toggleCount = async () => {
    try {
      const supabase = createClient();
      const newShareCount = shareCount + 1;
      const { error } = await supabase.from('Posts').update({ shared: newShareCount }).eq('postId', postId!);

      if (error) throw error;

      setShareCount(newShareCount);
      showShare();
    } catch (e) {
      console.error(e);
    }
  };
  const titleShare = !!tags
    ? `Share ${authorName}'s post from ${tags} category.`
    : `Share ${authorName}'s post from ${name} group.`;

  return (
    <div className={styles.share} popoverTarget="share-count">
      <button className={styles.sharButton} aria-label="share button" onClick={showShare}>
        <AiOutlineShareAlt />
      </button>
      <p id="share-count" className={shareCount >= 1000 ? styles.count : ''}>
        {shareCount}
      </p>
      <div className={`${styles.share__options} ${share ? styles.share__options__active : ''}`}>
        <LineShareButton url={shareUrl} title={titleShare} onClick={toggleCount}>
          <LineIcon className={styles.icon} />
        </LineShareButton>

        <WhatsappShareButton url={shareUrl} title={titleShare} onClick={toggleCount}>
          <WhatsappIcon className={styles.icon} />
        </WhatsappShareButton>

        <WeiboShareButton url={shareUrl} title={titleShare} onClick={toggleCount}>
          <WeiboIcon className={styles.icon} />
        </WeiboShareButton>
        <RWebShare data={{ url: shareUrl, title: titleShare }} onClick={toggleCount}>
          <button className={styles.more}>
            <Image src="/more.svg" fill alt="button for another options for sharing" />
          </button>
        </RWebShare>
      </div>
    </div>
  );
};
