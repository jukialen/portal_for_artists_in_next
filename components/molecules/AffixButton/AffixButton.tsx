import { MouseEventHandler, useState } from 'react';

import './AffixButton.module.scss';

import { Affix, Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';

export const AffixButton = () => {
  const [bottom, setBottom] = useState<number>(0);

  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const setBootom: MouseEventHandler = () => {
    setBottom(0);
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <Affix offsetBottom={bottom}>
      <Button type="primary" href="#" onClick={setBootom}>
        <UpOutlined
          className={`up ${visible ? 'up__active' : null}`}
          aria-label="top of page button"
        />
      </Button>
    </Affix>
  );
};
