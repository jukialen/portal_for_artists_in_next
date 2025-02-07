'use client';

import { useContext, useState } from 'react';
import { Button, Icon } from '@chakra-ui/react';

import { darkMode } from 'constants/links';

import { ModeContext } from 'providers/ModeProvider';

import { useScopedI18n } from 'locales/client';

import styles from './ModeContainer.module.scss';
import { LuSun } from 'react-icons/lu';
import { RxChevronDown } from 'react-icons/rx';

export const ModeContainer = ({ light, dark }: { light: string; dark: string }) => {
  const { isMode, changeMode } = useContext(ModeContext);
  const [mode, setMode] = useState(false);

  const newMode = (mode: 'dark' | 'light') => {
    changeMode(mode);
    showMode();
  };
  const showMode = () => setMode(!mode);

  const tSettings = useScopedI18n('Settings');

  return (
    <div className={styles.modeContainer}>
      <div>
        {isMode === darkMode ? (
          <LuSun aria-label="mode icon" className={styles.icon} />
        ) : (
          <Icon
            className={styles.icon}
            width="21"
            height="19"
            viewBox="0 0 21 19"
            fill="none"
            color="black.500"
            aria-label="mode icon">
            <path
              d="M20.3018 8.97222C20.3018 14.5104 15.7785 19 10.1987 19C4.61885 19 -0.356859 14.0992 0.0201253 8.97222C0.020125 5.42857 2.35742 1.35714 5.82566 0C0.0955227 10.7063 12.6867 17.0397 20.3018 8.97222Z"
              fill="black"
            />
          </Icon>
        )}
        <p className={isMode === darkMode ? styles.dark__title : ''}>{tSettings('dark_mode')}</p>
      </div>

      <ul className={styles.mode}>
        <li
          className={`${styles.colors__select} ${isMode === darkMode ? styles.colors__select__dark : ''}`}
          onClick={showMode}>
          <p className={styles.languages__version}>{isMode?.toLocaleUpperCase()}</p>
          <RxChevronDown />
        </li>

        <div
          className={`
            ${styles.color} ${mode && styles.color__active}
            ${isMode === darkMode && styles.color__active__dark}
            `}>
          <li>
            <Button
              className={`${styles.colors__version} ${isMode === darkMode && styles.colors__version__dark}`}
              onClick={() => newMode('dark')}>
              {dark}
            </Button>
          </li>
          <li>
            <Button
              className={`${styles.colors__version} ${isMode === darkMode && styles.colors__version__dark}`}
              onClick={() => newMode('light')}>
              {light}
            </Button>
          </li>
        </div>
      </ul>
    </div>
  );
};
