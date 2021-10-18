import { Article } from 'components/molecules/Article/Article';

import styles from './Wrapper.module.scss';

type wrapperType = {
  idWrapper: string;
};

export const Wrapper = ({ idWrapper }: wrapperType) => {
  return (
    <div className={styles.wrapper}>
      <div id={idWrapper} className={styles.carousel}>
        <div className={styles.content}>
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
        </div>
      </div>

      <button className={styles.top__left__arrow} aria-label="top left arrow" />
      <button className={styles.top__right__arrow} aria-label="top right arrow" />
    </div>
  );
};
