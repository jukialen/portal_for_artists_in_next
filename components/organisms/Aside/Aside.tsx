import { useState } from 'react';

import { useHookSWR } from 'hooks/useHookSWR';

import { Categories } from 'components/organisms/Categories/Categories';
import { Groups } from 'components/atoms/Groups/Groups';
import { Friends } from 'components/atoms/Friends/Friends';
import { Links } from 'components/atoms/Links/Links';

import styles from './Aside.module.scss';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export function Aside() {
  const [isLeftMenu, setLeftMenu] = useState<boolean>(false);
  const [open, setOpen] = useState(true);
  
  const arrowIcons = '1.5rem';
  
  const leftMenuClick = () => setLeftMenu(!isLeftMenu);
  const showCategories = () => setOpen(!open);
  
  return (
    <aside id='top__menu' className={`${styles.aside} ${isLeftMenu && styles.aside__active}`}>
      <button
        className={styles.aside__right}
        aria-label='left menu button'
        onClick={leftMenuClick}
      >
        {isLeftMenu ? <LeftOutlined /> : <RightOutlined />}
      </button>
      
      <h3
        className={`${styles.h3} ${isLeftMenu && styles.first__h3} ${!open ? styles.afterHidden : ''}`}
        onClick={showCategories}
      >
        <p>{useHookSWR()?.Aside?.category}</p>
        {open ? <TriangleUpIcon w={arrowIcons} h={arrowIcons} /> :
          <TriangleDownIcon w={arrowIcons} h={arrowIcons} />}
      </h3>
      
      <div className={open ? styles.container : styles.hidden__categories}>
        <Categories data={useHookSWR()} />
      </div>
      
      <Groups data={useHookSWR()} />
      
      <Friends />
      
      <div>
        <Links hrefLink='#'>
          <a><h3 className={styles.contact}>
            {useHookSWR()?.Aside?.contact}
          </h3></a>
        </Links>
      </div>
    </aside>
  );
}
