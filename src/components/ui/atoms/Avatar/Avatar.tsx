import { Avatar as ArkAvatar } from '@ark-ui/react/avatar';

import styles from './Avatar.module.scss';

 type AvatarType = {
    src: string;
    fallbackName: string;
    alt: string;
  };

export const Avatar = ({ src, fallbackName, alt }: AvatarType) => {
    return (
      <ArkAvatar.Root>
        <ArkAvatar.Fallback>{fallbackName}</ArkAvatar.Fallback>
        <ArkAvatar.Image src={src!} alt={alt} className={styles.avatarImage} />
      </ArkAvatar.Root>
    );
  };