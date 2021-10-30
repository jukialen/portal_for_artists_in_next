import { useState } from 'react';

import { Categories } from 'components/organisms/Categories/Categories';
import { Groups } from 'components/organisms/Groups/Groups';
import { Friends } from 'components/molecules/Friends/Friends';
import { Links } from 'components/atoms/Links/Links';

import styles from './Aside.module.scss';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export function Aside() {
  const [isLeftMenu, setLeftMenu] = useState<boolean>( false );
  
  const leftMenuClick = () => setLeftMenu( !isLeftMenu );
  
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
      
      <h3 className={`${styles.h3} ${isLeftMenu && styles.first__h3}`}>Kategorie</h3>
      
      <Categories />
      
      <h3>Grupy</h3>
      
      <Groups />
      
      <h3>Przyjaciele</h3>
      
      <Friends />
      
      <div>
        <Links hrefLink='#' elementLink={<h3 className={styles.contact}>Kontakt</h3>} />
      </div>
    </aside>
  );
}
