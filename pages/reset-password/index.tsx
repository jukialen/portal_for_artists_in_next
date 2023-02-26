import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { submitNewPassword } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { Divider, Input } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FormError } from 'components/molecules/FormError/FormError';
import { Footer } from 'components/molecules/Footer/Footer';

import styles from './index.module.scss';

const initialValues = {
  newPassword: '',
  repeatPassword: '',
};

type ResetPasswordType = {
    newPassword: string;
    repeatPassword: string;  
}

export default function ResetPassword() {
  const [valuesFields, setValuesFields] = useState<string>('');
  const data = useHookSWR();
  const { push, asPath } = useRouter();

  const schemaValidation = Yup.object({
    newPassword: SchemaValidation().password,
    repeatPassword: SchemaValidation().password,
  });

  const newPasswordEntered = async ({ newPassword, repeatPassword }: ResetPasswordType) => {
    try {
      if (newPassword !== repeatPassword) {
        setValuesFields("Values isn't the same");
        return null;
      } else {
        const response = await submitNewPassword({ formFields: [{ id: 'password', value: newPassword }] });

        if (response.status === 'FIELD_ERROR') {
          response.formFields.forEach((formField) => formField.id === 'password' && setValuesFields(formField.error));
        } else if (response.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR') {
          setValuesFields('Password reset failed. Please try again');
          push('/');
        } else {
          setValuesFields('Password reset successful!');
          push('/');
        }
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : 'Oops! Something went wrong.');
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={newPasswordEntered}>
        {({ values, handleChange, errors, touched }) => (
          <Form className={styles.reset}>
            <HeadCom path={asPath} content="The site for resetting password." />

            <div className={styles.borderContainer}>
              <h2 className={styles.title}>{data?.Forgotten?.title}</h2>
              <Divider />
              <h3 className={styles.subtitle}>{data?.Forgotten?.subtitle}</h3>
              <Input
                name="newPassword"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                className={touched.newPassword && !!errors.newPassword ? styles.inputForm__error : styles.inputForm}
                placeholder={data?.Account?.aData?.newPassword}
              />

              <FormError nameError="newPassword" />

              <Input
                name="repeatPassword"
                type="password"
                value={values.repeatPassword}
                onChange={handleChange}
                className={touched.repeatPassword && !!errors.repeatPassword ? styles.inputForm__error : styles.inputForm}
                placeholder={data?.Account?.aData?.againNewPassword}
              />

              <FormError nameError="repeatPassword" />

              <button
                type="submit"
                className={`button ${styles.submit__button}`}
                aria-label={data?.Forgotten?.buttonAria}>
                {data?.Account?.aData?.changePassword}
              </button>

              {!!valuesFields && <Alerts valueFields={valuesFields} />}
            </div>
          </Form>
        )}
      </Formik>
      <Footer />
    </>
  );
}
