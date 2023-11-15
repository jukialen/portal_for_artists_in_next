import { MouseEventHandler, useState } from 'react';
import { Affix, Button } from 'antd';

import styles from './AffixButton.module.scss';
import { UpOutlined } from '@ant-design/icons';

export const AffixButton = () => {
  const [bottom, setBottom] = useState<number>(0);

  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    let scrolled;
    if (typeof document !== 'undefined') {
      scrolled = document.documentElement.scrollTop;
      scrolled > 300 ? setVisible(true) : setVisible(false);
    }
  };

  const changeBottom: MouseEventHandler = () => setBottom(0);

  typeof window !== 'undefined' && window.addEventListener('scroll', toggleVisible);

  return (
    <Affix offsetBottom={bottom}>
      <Button type="primary" href="#" onClick={changeBottom}>
        <UpOutlined
          className={`${styles.up} ${visible && styles.up__active}`}
          aria-label="top of page button"
          alt="top of page button"
        />
      </Button>
    </Affix>
  );
};
