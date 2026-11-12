'use client';

import { useState } from 'react';

import { locales } from 'constants/values';
import { LangType } from 'types/global.types';
import { useChangeLocale, useI18n } from 'locales/client';

import styles from './LanguagesSettings.module.css';
import { MdLanguage } from 'react-icons/md';
import { RxChevronDown } from 'react-icons/rx';

export const LanguagesSettings = ({ locale }: { locale: LangType }) => {
  const [isLanguage, setLanguage] = useState(false);
  const changeLocale = useChangeLocale();

  const t = useI18n();

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
        <button className={styles.languages__select} onClick={showLanguages}>
          {locale.toLocaleUpperCase()}
          <RxChevronDown />
        </button>

        <div className={isLanguage ? styles.language__active : styles.language}>
          {locales.map((_l) => (
            <button key={_l} className={styles.languages__version} onClick={() => redirectedPathName(_l)}>
              {_l.toLocaleUpperCase()}
            </button>
          ))}
        </div>
      </ul>
    </div>
  );
};
