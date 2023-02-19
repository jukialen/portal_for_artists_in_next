import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { emailPasswordSignIn } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, FormType, UserDataType } from 'types/global.types';

import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import styles from '../NavForm.module.scss';
import { Divider, Input } from '@chakra-ui/react';

const initialValues = {
  email: '',
  password: '',
};

export const Login = ({ data }: DataType) => {
  const { isLogin, showLoginForm } = useContext(NavFormContext);
  const { showMenu } = useContext(ShowMenuContext);
  const { showUser } = useContext(StatusLoginContext);

  const [valuesFields, setValuesFields] = useState<string>('');

  const { push } = useRouter();

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const hideMenuLogin = () => {
    showLoginForm();
    showMenu();
  };

  const submitAccountData = async ({ email, password }: UserDataType, { resetForm }: FormType) => {
    // setValuesFields(data?.NavForm?.unVerified);
   
    try {
      const response = await emailPasswordSignIn({
        formFields: [
          { id: "email", value: email!}, 
          { id: "password", value: password!}
        ]
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach(formField => setValuesFields(formField.error));
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setValuesFields("Email password combination is incorrect.");
      } else {
        resetForm(initialValues);
        setValuesFields(data?.NavForm?.statusLogin);
        showLoginForm();
        showUser();
        push('/app');
      }
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.error);
    }
  };



  const forgotten__password = () => {
    hideMenuLogin();
    return push('/forgotten');
  };

  return (
    <div className={`${styles.login} ${isLogin ? styles.form__menu__active : ''}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={schemaValidation}
        onSubmit={submitAccountData}>
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <h2 className={styles.title}>{data?.NavForm?.titleOfLogin}</h2>

            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={data?.NavForm?.email}
              className={
                touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm
              }
            />

            <FormError nameError="email" />

            <Input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder={data?.NavForm?.password}
              className={
                touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm
              }
            />

            <FormError nameError="password" />

            <button
              type="submit"
              className={`button ${styles.submit__button}`}
              aria-label="login button">
              {data?.NavForm?.loginSubmit}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}

            <button className={`button ${styles.forgotten}`} onClick={forgotten__password}>
              I forgot my password
            </button>
          </Form>
        )}
      </Formik>

      <Divider width="90%" />

      <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>

      <Providers />
    </div>
  );
};
