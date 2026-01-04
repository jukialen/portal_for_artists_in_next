'use client';

import { useState } from 'react';

import { locales } from 'constants/values';
import { LangType } from 'types/global.types';
import { useChangeLocale, useI18n } from 'locales/client';

import styles from './LanguagesSettings.module.scss';
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

        <div className={`${styles.language} ${isLanguage && styles.language__active}`}>
          {locales.map((_l) => {
            return (
              <li key={_l}>
                <button onClick={() => redirectedPathName(_l)} className={styles.languages__version}>
                  {_l.toLocaleUpperCase()}
                </button>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};
