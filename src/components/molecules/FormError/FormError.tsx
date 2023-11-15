import { ErrorMessage } from 'formik';

import styles from './FormError.module.scss';

type fE = {
  nameError: string;
};

export const FormError = ({ nameError }: fE) => {
  return (
    <p className={styles.error}>
      <ErrorMessage name={nameError} />
    </p>
  );
};
