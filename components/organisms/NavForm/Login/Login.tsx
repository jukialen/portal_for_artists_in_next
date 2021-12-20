import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserDataType } from 'next-env';
import { auth } from '../../../../firebase';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';

import { NavFormContext } from 'providers/NavFormProvider';
import { StatusLoginContext } from "providers/StatusLogin";
import { ShowMenuContext } from "providers/ShowMenuProvider";

import styles from '../NavForm.module.scss';

const initialValues = {
  email: '',
  password: '',
};

export const Login = ({ data }: any) => {
  const { isLogin, showLoginForm } = useContext(NavFormContext);
  const { showUser } = useContext(StatusLoginContext);
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
    .then((userCredential) => {
      const user = userCredential.user;
      !user.emailVerified && setValuesFields('Nie zweryfikowałeś e-maila.');
      if (user.emailVerified) {
        resetForm(initialValues);
        push('/app');
        showUser();
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
      <Form className={`${styles.login} ${isLogin ? styles.form__menu__active : ''}`}>
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
        
        <p className={styles.separator}>__________________</p>
        
        <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>
        
        <Providers />
      
      </Form>
    </Formik>
  );
};

