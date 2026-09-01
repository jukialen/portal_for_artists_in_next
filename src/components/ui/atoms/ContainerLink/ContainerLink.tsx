import Image, { StaticImageData } from 'next/image';

import { ContainerLinkType } from 'types/global.types';

import { Links } from 'components/ui/atoms/Links/Links';

import styles from './ContainerLink.module.css';

export const ContainerLink = ({ link, name, description, logo, alt }: ContainerLinkType) => {
  return (
    <Links hrefLink={link} classLink={styles.link} arial-label={description}>
      {typeof logo === 'string' ? (
        <img src={logo} className={styles.image} alt={`${name} logo`} />
      ) : (
        <Image src={logo} className={styles.image} alt={alt} />
      )}
      <h4 className={styles.name}>{name}</h4>
    </Links>
  );
};
