'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon, Switch } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { ModeContext } from 'providers/ModeProvider';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

import styles from './index.module.scss';

import { ChevronDownIcon, SunIcon } from '@chakra-ui/icons';
import { MdLanguage } from 'react-icons/md';

export default function Setings() {
  const { isMode, changeMode } = useContext(ModeContext);
  const [isLanguage, setLanguage] = useState(false);
  const data = useHookSWR();
  const { asPath, locale } = useRouter();

  const showLanguages = () => setLanguage(!isLanguage);

  return (
    <>
      <HeadCom path={asPath} content="Settings site for unlogged in users" />

      <div className={styles.settingsMode}>
        <h2 className={styles.title}>{data?.Settings?.title}</h2>

        <div className={styles.modeContainer}>
          <div>
            {isMode ? (
              <SunIcon aria-label="mode icon" className={styles.icon} />
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
            <p>{data?.Settings?.dark_mode}</p>
          </div>
          <Switch
            colorScheme="pink"
            id="switch-mode"
            size="lg"
            className={styles.icon}
            isChecked={!!isMode}
            onChange={changeMode}
          />
        </div>

        <div className={styles.langMenu}>
          <div>
            <MdLanguage className={styles.icon} />
            <p>{data?.Footer?.changeLanguage}</p>
          </div>

          <ul className={styles.languages}>
            <li
              className={`${styles.languages__select} ${!isMode ? styles.langMenu__value : ''}`}
              onClick={showLanguages}>
              <p className={styles.languages__version}>{locale?.toLocaleUpperCase()}</p>
              <ChevronDownIcon />
            </li>

            <div
              className={`${styles.language} ${isLanguage && styles.language__active} ${
                isMode && styles.language__active__dark
              }`}>
              <li>
                <Link
                  href={asPath}
                  locale="en"
                  className={`${styles.languages__version} ${isMode && styles.languages__version__dark}`}
                  onClick={() => setLanguage(!isLanguage)}>
                  EN
                </Link>
              </li>
              <li>
                <Link
                  href={asPath}
                  locale="jp"
                  className={`${styles.languages__version} ${isMode && styles.languages__version__dark}`}
                  onClick={() => setLanguage(!isLanguage)}>
                  JP
                </Link>
              </li>
              <li>
                <Link
                  href={asPath}
                  locale="pl"
                  className={`${styles.languages__version} ${isMode && styles.languages__version__dark}`}
                  onClick={() => setLanguage(!isLanguage)}>
                  PL
                </Link>
              </li>
            </div>
          </ul>
        </div>

        <footer>
          <button className={styles.links}>
            <Link href="/terms">{data?.Footer?.termsOfUse}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/privacy">{data?.Footer?.privacyPolice}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/contact">{data?.Footer?.contact}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/faq">{data?.Footer?.faq}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/plans">{data?.Footer?.plans}</Link>
          </button>
        </footer>
      </div>
    </>
  );
}
