'use client';

import { useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';

import { darkMode } from 'source/constants/links';
import { LangType } from 'source/types/global.types';

import { useChangeLocale, useCurrentLocale, useI18n } from "source/locales/client";

import { ModeContext } from 'source/providers/ModeProvider';

import styles from './LanguagesSettings.module.scss';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdLanguage } from 'react-icons/md';

export const LanguagesSettings = () => {
  const { isMode } = useContext(ModeContext);
  const [isLanguage, setLanguage] = useState(false);
  const changeLocale = useChangeLocale();

  const locale = useCurrentLocale();
  const t = useI18n();
  
  const locales: LangType[] = ['en', 'jp', 'pl'];

  const redirectedPathName = (locale: LangType) => {
    setLanguage(!isLanguage);
    return changeLocale(locale);
  };

  const showLanguages = () => setLanguage(!isLanguage);

  return (
    <div className={styles.langMenu}>
      <div>
        <MdLanguage className={styles.icon} />
        <p className={isMode === darkMode ? styles.dark__title : ''}>{t('Footer.changeLanguage')}</p>
      </div>

      <ul className={styles.languages}>
        <li
          className={`${styles.languages__select} ${isMode === darkMode ? styles.languages__select__dark : ''}`}
          onClick={showLanguages}>
          <p>{locale.toLocaleUpperCase()}</p>
          <ChevronDownIcon />
        </li>

        <div
          className={`${styles.language} ${isLanguage && styles.language__active} ${
            isMode === darkMode && styles.language__active__dark
          }`}>
          {locales.map((_l) => {
            return (
              <li key={_l}>
                <Button
                  onClick={() => redirectedPathName(_l)}
                  className={`${styles.languages__version} ${isMode === darkMode && styles.languages__version__dark}`}>
                  {_l.toLocaleUpperCase()}
                </Button>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};
