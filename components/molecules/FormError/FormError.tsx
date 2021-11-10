import { ErrorMessage } from 'formik';

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
