import { useState } from 'react';

import { useHookSWR } from 'hooks/useHookSWR';

import { Categories } from 'components/organisms/Categories/Categories';
import { Groups } from 'components/organisms/Groups/Groups';
import { Friends } from 'components/molecules/Friends/Friends';
import { Links } from 'components/atoms/Links/Links';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import styles from './Aside.module.scss';

export function Aside() {
  
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
      
      <h3 className={`${styles.h3} ${isLeftMenu && styles.first__h3}`}>{useHookSWR()?.Aside?.category}</h3>
      
      <Categories data={useHookSWR()} />
      
      <h3 className={styles.group__title}>{useHookSWR()?.Aside?.groups}</h3>
      
      <Groups data={useHookSWR()} />
      
      <h3 className={styles.friend__title}>{useHookSWR()?.Aside?.friends}</h3>
      
      <Friends />
      
      <div>
        <Links hrefLink='#' elementLink={<h3 className={styles.contact}>{useHookSWR()?.Aside?.contact}</h3>} />
      </div>
    </aside>
  );
}
