import { ErrorMessage } from 'formik';

import styles from './FormError.module.scss';

export const FormError = ({ nameError }: { nameError: string }) => {
  return (
    <p className={styles.error}>
      <ErrorMessage name={nameError} />
    </p>
  );
};
