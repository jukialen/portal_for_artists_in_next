import { ErrorMessage } from 'formik';
import styles from "../../organisms/NavForm/NavForm.module.scss";

type fE = {
  className?: string;
  nameError: string;
};

export const FormError = ({ nameError, className }: fE) => {
  return (
    <p className={className}>
      <ErrorMessage name={nameError} />
    </p>
  );
};
