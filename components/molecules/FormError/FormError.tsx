import { ErrorMessage } from 'formik';

type fE = {
  nameError: string;
};

export const FormError = ({ nameError }: fE) => {
  return (
    <p>
      <ErrorMessage name={nameError} />
    </p>
  );
};
