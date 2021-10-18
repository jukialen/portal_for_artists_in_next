import { useState } from 'react';

import { Categories } from 'components/organisms/Categories/Categories';
import { Groups } from 'components/organisms/Groups/Groups';
import { Friends } from 'components/molecules/Friends/Friends';
import { Links } from 'components/atoms/Links/Links';
import { Button } from 'components/atoms/Button/Button';

import styles from './Aside.module.scss';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export function Aside() {
  const [isLeftMenu, setLeftMenu] = useState<boolean>(false);

  const leftMenuClick = () => setLeftMenu(!isLeftMenu);

  return (
    <aside id="top__menu" className={`styles.aside ${isLeftMenu ? 'styles.aside--active' : ''}`}>
      <Button
        elementButton={isLeftMenu ? <LeftOutlined /> : <RightOutlined />}
        classButton={styles.aside__right}
        ariaLabel="left menu button"
        // @ts-ignore
        onClick={leftMenuClick}
      />

      <h3 className={`styles.h3 ${isLeftMenu ? styles.first__h3 : ''}`}>Kategorie</h3>

      <Categories />

      <h3>Grupy</h3>

      <Groups />

      <h3>Przyjaciele</h3>

      <Friends />

      <div>
        <Links hrefLink="#" elementLink={<h3 className={styles.contact}>Kontakt</h3>} />
      </div>
    </aside>
  );
}
