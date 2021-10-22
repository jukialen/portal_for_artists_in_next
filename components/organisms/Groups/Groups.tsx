import { Button } from 'components/atoms/Button/Button';
import { Links } from 'components/atoms/Links/Links';

import styles from './Groups.module.scss';

export const Groups = () => {
  return (
    <div className={styles.groups}>
      <Button classButton={styles.groups__item} title="Dodaj grupę" ariaLabel="Adding a group" />

      <Links hrefLink="#" classLink={styles.groups__item} elementLink={<h4>Mangowcy Polska</h4>} />
      <Links hrefLink="#" classLink={styles.groups__item} elementLink={<h4>Fani krajobrazów</h4>} />
      <Links hrefLink="#" classLink={styles.groups__item} elementLink={<h4>Filmowcy World</h4>} />
      <Links hrefLink="#" classLink={styles.groups__item} elementLink={<h4>Pomalowany świat</h4>} />
      <Links hrefLink="#" classLink={styles.groups__item} elementLink={<h4>Ołówkiem po mapie</h4>} />
    </div>
  );
};
