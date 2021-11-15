import { useState } from 'react';
import { useRouter } from "next/router";
import useSWR from "swr";

import { Categories } from 'components/organisms/Categories/Categories';
import { Groups } from 'components/organisms/Groups/Groups';
import { Friends } from 'components/molecules/Friends/Friends';
import { Links } from 'components/atoms/Links/Links';

import styles from './Aside.module.scss';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export function Aside() {
  const { locale } = useRouter();
// @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${locale}.json`, fetcher);
  
  const [isLeftMenu, setLeftMenu] = useState<boolean>(false);
  const leftMenuClick = () => setLeftMenu(!isLeftMenu);
  
  return (
    <aside id='top__menu' className={`${styles.aside} ${isLeftMenu && styles.aside__active}`}>
      <button
        className={styles.aside__right}
        aria-label='left menu button'
        // @ts-ignore
        onClick={leftMenuClick}
      >
        {isLeftMenu ? <LeftOutlined /> : <RightOutlined />}
      </button>
      
      <h3 className={`${styles.h3} ${isLeftMenu && styles.first__h3}`}>{data?.Aside?.category}</h3>
      
      <Categories />
      
      <h3 className={styles.group__title}>{data?.Aside?.groups}</h3>
      
      <Groups />
      
      <h3 className={styles.friend__title}>{data?.Aside?.friends}</h3>
      
      <Friends />
      
      <div>
        <Links hrefLink='#' elementLink={<h3 className={styles.contact}>{data?.Aside?.contact}</h3>} />
      </div>
    </aside>
  );
}
