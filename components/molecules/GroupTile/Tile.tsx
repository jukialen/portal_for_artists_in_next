import Image from 'next/image';

import { Links } from 'components/atoms/Links/Links';

import styles from './GroupTile.module.scss';

type TileType = {
  name: string;
  link: string;
  logoUrl: string;
};
export const Tile = ({ name, link, logoUrl }: TileType) => {
  const sizes = 288;

  return (
    <article className={styles.tile}>
      <Links hrefLink={link} classLink={styles.link}>
        <Image src={logoUrl} width={sizes} height={sizes} className={styles.thumbnail} alt={name} />
        <p className={styles.nameGroup}>{name}</p>
      </Links>
    </article>
  );
};
