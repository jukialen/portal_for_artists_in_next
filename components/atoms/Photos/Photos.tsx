import styles from './Photos.module.scss';
import { Image } from 'antd';

export const Photos = (link: string, alternativeText: any, ...props: any[]) => {
  return <div className={styles.photos} {...props}>
    {/*<Image src={link} layout='fill' alt={alternativeText} aria-label={alternativeText} priority />*/}
  </div>;
};

// <html>TS2322: Type '{ src: string; layout: string; alt: string; &quot;aria-label&quot;: string; priority: true; }' is not assignable to type 'IntrinsicAttributes &amp; ImageProps &amp; { children?: ReactNode; }'.<br/>Property 'layout' does not exist on type 'IntrinsicAttributes &amp; ImageProps &amp; { children?: ReactNode; }'.