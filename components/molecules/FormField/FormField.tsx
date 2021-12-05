import { Field } from 'formik';

import styles from './FormField.module.scss';

type fF = {
  titleField: string;
  nameField: string;
  typeField: string;
  placeholderField: string;
  element?: any;
};

export const FormField = ({
  titleField,
  nameField,
  typeField,
  placeholderField,
  element,
  ...props
}: fF) => {
  return (
    <div className={styles.form__field}>
      <label htmlFor={nameField} className={styles.label}>
        {titleField}
        {element}
      </label>
      <Field
        name={nameField}
        type={typeField}
        id={nameField}
        placeholder={placeholderField}
        {...props}
        className={styles.input}
      />
    </div>
  );
};
