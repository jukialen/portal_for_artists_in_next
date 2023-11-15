import Image from 'next/image';

import { Links } from 'src/components/atoms/Links/Links';

import styles from './GroupTile.module.scss';

type TileType = {
  name: string;
  link: string;
  fileUrl: string;
};
export const Tile = ({ name, link, fileUrl }: TileType) => {
  const sizes = 256;

  return (
    <article className={styles.tile}>
      <Links hrefLink={link} classLink={styles.link}>
        <Image src={fileUrl} width={sizes} height={sizes} className={styles.thumbnail} alt={name} />
        <p className={styles.nameGroup}>{name}</p>
      </Links>
    </article>
  );
};
