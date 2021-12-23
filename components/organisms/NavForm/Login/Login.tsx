import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../../firebase';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';

import { NavFormContext } from 'providers/NavFormProvider';
import { ShowMenuContext } from "providers/ShowMenuProvider";

import styles from '../NavForm.module.scss';

type UserDataType = {
  email: string,
  password: string
}

const initialValues = {
  email: '',
  password: '',
};

export const Login = ({ data }: any) => {
  const { isLogin, showLoginForm } = useContext(NavFormContext);
  const { showMenu } = useContext(ShowMenuContext);
  
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const { push } = useRouter();
  
  const hideMenuLogin = () => {
    showLoginForm();
    showMenu();
  };
  
  // @ts-ignore
  const submitAccountData = async ({ email, password }: UserDataType, { resetForm }) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      !user.emailVerified && setValuesFields(data?.NavForm?.unVerified);
      if (user.emailVerified) {
        resetForm(initialValues);
        setValuesFields(data?.NavForm?.statusLogin);
        showLoginForm();
        await localStorage.getItem('fD') === `${process.env.NEXT_APP_LSTORAGE}` ? await push('/app'): await push('/new-user');
      }
    })
    .catch(() => {
      setValuesFields(data?.NavForm?.setErrorMessageLogin);
    });
  };
  
  const forgotten__password = () => {
    hideMenuLogin();
    return push('/forgotten');
  }
  
  return (
    <div className={`${styles.login} ${isLogin ? styles.form__menu__active : ''}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          email: Yup.string().email(data?.NavForm?.validateEmail).required(data?.NavForm?.validateRequired),
      
          password: Yup.string()
          .min(9, data?.NavForm?.validatePasswordNum)
          .matches(/[A-Z]+/g, data?.NavForm?.validatePasswordOl)
          .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validatePasswordHKik)
          .matches(/[0-9]+/g, data?.NavForm?.validatePasswordOn)
          .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePasswordSpec)
          .required(data?.NavForm?.validateRequired),
        })}
        onSubmit={submitAccountData}
      >
        <Form>
          <h2 className={styles.title}>{data?.NavForm?.titleOfLogin}</h2>
      
          <FormField
            titleField={`${data?.NavForm?.email}:`}
            nameField='email'
            typeField='email'
            placeholderField={data?.NavForm?.email}
          />
      
          <FormError className={styles.error} nameError='email' />
      
          <FormField
            titleField={`${data?.NavForm?.password}:`}
            nameField='password'
            typeField='password'
            placeholderField={data?.NavForm?.password}
          />
      
          <FormError className={styles.error} nameError='password' />
      
          <button
            type='submit'
            className={`button ${styles.submit__button}`}
            aria-label='login button'
          >
            {data?.NavForm?.loginSubmit}
          </button>
      
          {!!valuesFields && <p className={styles.fields__info}>{valuesFields}</p>}
  
          <button className={`button ${styles.forgotten}`} onClick={forgotten__password}>I forgot my password</button>
        </Form>
      </Formik>
      
      <p className={styles.separator}>__________________</p>
  
      <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>
  
      <Providers />
    </div>
    
  );
};

