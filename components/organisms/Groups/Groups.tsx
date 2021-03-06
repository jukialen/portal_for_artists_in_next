import { DataType } from 'types/global.types';

import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';

export const Groups = ({ data }: DataType) => {
  
  return (
    <div className={styles.groups}>
      <button className={`${styles.groups__button} button`} aria-label={data?.Aside?.addingGroup}>
        {data?.Aside?.addingGroup}
      </button>
      
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Mangowcy Polska</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Fani krajobrazów</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Filmowcy World</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Pomalowany świat</h4>} />
      <Links hrefLink='#' classLink={styles.groups__item} elementLink={<h4>Ołówkiem po mapie</h4>} />
    </div>
  );
};
