'use client';

import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';

import { darkMode } from 'constants/links';
import { ModeType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { useScopedI18n } from 'locales/client';

import styles from './ModeContainer.module.scss';
const LuSun = dynamic(() => import('react-icons/lu').then((mod) => mod.LuSun), {
  ssr: false,
});
import { RxChevronDown } from 'react-icons/rx';
import { HiMoon } from 'react-icons/hi2';

export const ModeContainer = ({ light, dark }: { light: string; dark: string }) => {
  const { isMode, changeMode } = useContext(ModeContext);
  const [mode, setMode] = useState(false);

  const newMode = (mode: ModeType) => {
    changeMode(mode);
    showMode();
  };
  const showMode = () => setMode(!mode);

  const tSettings = useScopedI18n('Settings');

  return (
    <div className={styles.modeContainer}>
      <div>
        {isMode === darkMode ? (
          <LuSun className={styles.icon} aria-label="mode icon" />
        ) : (
          <HiMoon className={styles.icon} aria-label="mode icon" />
        )}
        <p>{tSettings('dark_mode')}</p>
      </div>

      <ul className={styles.mode}>
        <li className={styles.colors__select} onClick={showMode}>
          <p className={styles.languages__version}>{isMode?.toLocaleUpperCase()}</p>
          <RxChevronDown />
        </li>

        <div className={`${styles.color} ${mode && styles.color__active}`}>
          <li>
            <button className={styles.colors__version} onClick={() => newMode('dark')}>
              {dark}
            </button>
          </li>
          <li>
            <button className={styles.colors__version} onClick={() => newMode('light')}>
              {light}
            </button>
          </li>
        </div>
      </ul>
    </div>
  );
};
