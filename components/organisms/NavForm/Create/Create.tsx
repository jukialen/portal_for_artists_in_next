import { useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { doesEmailExist, emailPasswordSignUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, ResetFormType, UserFormType } from 'types/global.types';

import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import { NavFormContext } from 'providers/NavFormProvider';

import styles from '../NavForm.module.scss';
import { Divider, Input } from '@chakra-ui/react';

const initialValues = {
  email: '',
  password: '',
};

export const Create = ({ data }: DataType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valuesFields, setValuesFields] = useState<string>('');
  const { locale, push } = useRouter();

  const { isCreate, showCreateForm, showLoginForm } = useContext(NavFormContext);

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const changeForm = () => {
    showLoginForm();
    showCreateForm();
  };

  const registration = async ({ email, password }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      setIsLoading(true);
      const exist = await doesEmailExist({ email });

      if (exist.doesExist) {
        setValuesFields(data?.NavForm?.theSameEmail);
        resetForm(initialValues);
        setIsLoading(false);
        await push('/');
        return null;
      }

      const response = await emailPasswordSignUp({
        formFields: [
          { id: 'email', value: email! },
          { id: 'password', value: password! },
        ],
      });

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((formField: { id: string; error: string }) => {
          setValuesFields(
            formField.error === 'This email already exists. Please sign in instead.'
              ? data?.NavForm?.theSameEmail
              : formField.error,
          );
          return null;
        });
      } else {
        const res = await sendVerificationEmail();

        if (res.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
          resetForm(initialValues);
          showCreateForm();
          showLoginForm();
          setIsLoading(false);
          return null;
        } else {
          resetForm(initialValues);
          setValuesFields(data?.NavForm?.successInfoRegistration);
          setIsLoading(false);
          return null;
        }
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.error);
      setIsLoading(!isLoading);
    }
  };

  return (
    <div className={`${styles.create__account} ${isCreate ? styles.form__menu__active : ''}`}>
      <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={registration}>
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <h2 className={styles.title}>{data?.NavForm?.titleOfRegistration}</h2>

            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={data?.NavForm?.email}
              className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
            />

            <FormError nameError="email" />

            <Input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder={data?.NavForm?.password}
              className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
            />

            <FormError nameError="password" />

            <button type="submit" className={`button ${styles.submit__button}`} aria-label="login button">
              {isLoading ? data?.NavForm?.loadingRegistration : data?.NavForm?.createSubmit}
            </button>

            {!!valuesFields && (
              <div className={styles.chakraAlert}>
                <Alerts valueFields={valuesFields} />
              </div>
            )}
          </Form>
        )}
      </Formik>

      <div className={styles.dividerWIthText}>
        <Divider />
        <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleRegistration}</h4>
        <Divider />
      </div>

      <Providers />
      <p className={styles.acceptInfo}>
        {data?.NavForm?.acceptInfoOne}
        <a href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '/terms' : `/${locale}/terms`}`}>
          {data?.NavForm?.acceptInfoTwo}
        </a>
        {data?.NavForm?.acceptInfoThree}
        <a href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '/privacy' : `/${locale}/privacy`}`}>
          {data?.NavForm?.acceptInfoFour}
        </a>
        {data?.NavForm?.dot}
      </p>

      <p className={styles.changeForm}>
        {data?.NavForm?.changeToCreate}
        <a onClick={changeForm}>{data?.Nav?.signIn}</a>
      </p>
    </div>
  );
};
