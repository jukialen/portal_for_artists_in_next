import Image from 'next/image';

import { GroupType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './GroupTile.module.scss';

export const GroupTile = ({ nameGroup, logoUrl }: GroupType) => {
  const sizes = 288;
  
  return <article className={styles.tile}>
    <Links
      hrefLink={`/groups/${nameGroup}`}
      classLink={styles.link}
    >
      <Image
        src={logoUrl}
        width={sizes}
        height={sizes}
        className={styles.thumbnail}
        alt={nameGroup}
      />
      <p className={styles.nameGroup}>{nameGroup}</p>
    </Links>
  </article>
}