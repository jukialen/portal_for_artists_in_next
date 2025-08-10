'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';

import { LangType } from 'types/global.types';
import { useChangeLocale, useI18n } from 'locales/client';

import styles from './LanguagesSettings.module.scss';
import { MdLanguage } from 'react-icons/md';
import { RxChevronDown } from 'react-icons/rx';

export const LanguagesSettings = ({ locale }: { locale: LangType }) => {
  const [isLanguage, setLanguage] = useState(false);
  const changeLocale = useChangeLocale();

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
        <p>{t('Footer.changeLanguage')}</p>
      </div>

      <ul className={styles.languages}>
        <li className={styles.languages__select} onClick={showLanguages}>
          <p>{locale.toLocaleUpperCase()}</p>
          <RxChevronDown />
        </li>

        <div className={`${styles.language} ${isLanguage && styles.language__active}`}>
          {locales.map((_l) => {
            return (
              <li key={_l}>
                <Button onClick={() => redirectedPathName(_l)} className={styles.languages__version}>
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
