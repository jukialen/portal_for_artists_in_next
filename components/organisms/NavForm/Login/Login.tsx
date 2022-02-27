import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { DataType, FormType, UserDataType } from 'types/global.types';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import styles from '../NavForm.module.scss';

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
    signInWithEmailAndPassword(auth, email!, password!)
    .then(async (userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        resetForm(initialValues);
        setValuesFields(data?.NavForm?.statusLogin);
        showLoginForm();
        await push('/app');
        await showUser();
      } else {
        setValuesFields(data?.NavForm?.unVerified);
      }
    })
    .catch(() => {
      setValuesFields(data?.NavForm?.setErrorMessageLogin);
    });
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
        onSubmit={submitAccountData}
      >
        <Form>
          <h2 className={styles.title}>{data?.NavForm?.titleOfLogin}</h2>
          
          <FormField
            titleField={data?.NavForm?.email}
            nameField='email'
            typeField='email'
            placeholderField={data?.NavForm?.email}
          />
          
          <FormError nameError='email' />
          
          <FormField
            titleField={data?.NavForm?.password}
            nameField='password'
            typeField='password'
            placeholderField={data?.NavForm?.password}
          />
          
          <FormError nameError='password' />
          
          <button
            type='submit'
            className={`button ${styles.submit__button}`}
            aria-label='login button'
          >
            {data?.NavForm?.loginSubmit}
          </button>
  
          {!!valuesFields && <Alerts valueFields={valuesFields} />}
          
          <button className={`button ${styles.forgotten}`} onClick={forgotten__password}>
            I forgot my password
          </button>
        </Form>
      </Formik>
      
      <p className={styles.separator}>__________________</p>
      
      <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>
      
      <Providers />
    </div>
  
  );
};

