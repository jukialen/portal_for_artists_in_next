import { useState } from 'react';
import Image from 'next/image';
import { IconButton } from '@chakra-ui/react';

import { Tags } from 'src/types/global.types';

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

  const icon = 40;
  const border = 20;
  const titleShare = !!tags
    ? `Share ${authorName}'s post from ${tags} category.`
    : `Share ${authorName}'s post from ${name} group.`;

  return (
    <div className={styles.share}>
      <IconButton
        icon={<AiOutlineShareAlt />}
        variant="solid"
        colorScheme="teal"
        aria-label="share button"
        border="1px solid transparent"
        fontSize="20px"
        cursor="pointer"
        onClick={showShare}
      />

      <div className={`${styles.share__options} ${share ? styles.share__options__active : ''}`}>
        <div className={styles.icon}>
          <LineShareButton url={shareUrl} title={titleShare}>
            <LineIcon size={icon} borderRadius={border} />
          </LineShareButton>
        </div>
        <div className={styles.icon}>
          <WhatsappShareButton url={shareUrl} title={titleShare}>
            <WhatsappIcon size={icon} borderRadius={border} />
          </WhatsappShareButton>
        </div>
        <div className={styles.icon}>
          <WeiboShareButton url={shareUrl} title={titleShare}>
            <WeiboIcon size={icon} borderRadius={border} />
          </WeiboShareButton>
        </div>
        <div className={styles.icon}>
          <RWebShare data={{ url: shareUrl, title: titleShare }} onClick={() => console.log('shared successfully!')}>
            <button className={styles.more}>
              <Image src="/more.svg" fill alt="button for another options for sharing" />
            </button>
          </RWebShare>
        </div>
      </div>
    </div>
  );
};
