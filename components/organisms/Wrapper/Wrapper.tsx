import { useContext } from "react";
import Image from 'next/image';

import { Article } from 'components/molecules/Article/Article';

import { ModeContext } from "providers/ModeProvider";

import styles from './Wrapper.module.scss';

type wrapperType = {
  idWrapper: string;
};

export const Wrapper = ({ idWrapper }: wrapperType) => {
  const { isMode } = useContext(ModeContext);
  
  return (
    <div className={styles.wrapper}>
      <div id={idWrapper} className={styles.carousel}>
        <div className={styles.content}>
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
          <Article imgLink='/#' imgDescription='Photo title' authorName='Z bazy' />
        </div>
      </div>
      
      <button className={styles.top__left__arrow} aria-label='top left arrow'>
        <Image src={isMode ? '/left__arrow__dark__mode.svg' : '/left__arrow__light__mode.svg'} layout='fill' aria-label='left arrow icon' />
      </button>
      <button className={styles.top__right__arrow} aria-label='top right arrow'>
        <Image src={isMode ? '/right__arrow__dark__mode.svg' : '/right__arrow__light__mode.svg'} layout='fill' aria-label='right arrow icon' />
      </button>
    </div>
  );
};
