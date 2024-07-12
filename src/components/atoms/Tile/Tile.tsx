import Image from 'next/image';

import styles from './GroupTile.module.scss';
import { Link } from "@chakra-ui/next-js";

type TileType = {
  name: string;
  link: string;
  fileUrl: string;
};
export const Tile = ({ name, link, fileUrl }: TileType) => {
  const sizes = 256;

  return (
    <article className={styles.tile}>
      <Link href={link} className={styles.link}>
        <Image src={fileUrl} width={sizes} height={sizes} className={styles.thumbnail} alt={name} />
        <p className={styles.nameGroup}>{name}</p>
      </Link>
    </article>
  );
};
