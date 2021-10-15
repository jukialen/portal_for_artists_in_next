import { Field } from 'formik';

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
    <div className="form__field">
      <label htmlFor="pseudonym">
        {titleField}
        {element}
      </label>
      <Field
        name={nameField}
        type={typeField}
        id={nameField}
        placeholder={placeholderField}
        {...props}
      />
    </div>
  );
};
