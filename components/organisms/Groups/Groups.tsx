import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';

export const Groups = () => {
  return (
    <div className={styles.groups}>
      <button className={`${styles.groups__button} button`} aria-label='Adding a group'>
        Dodaj grupę
      </button>
      
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Mangowcy Polska</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Fani krajobrazów</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Filmowcy World</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Pomalowany świat</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Ołówkiem po mapie</h4>} />
    </div>
  );
};
