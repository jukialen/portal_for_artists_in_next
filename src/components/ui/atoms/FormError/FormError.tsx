import { ErrorMessage } from 'formik';

import styles from './FormError.module.css';

export const FormError = ({ nameError }: { nameError: string }) => {
  return (
    <p className={styles.error}>
      <ErrorMessage name={nameError} />
    </p>
  );
};
