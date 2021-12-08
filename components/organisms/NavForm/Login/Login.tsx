import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'pages/api/signin';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';

import { NavFormContext } from 'providers/NavFormProvider';
import { StatusLoginContext } from "providers/StatusLogin";
import { ShowMenuContext } from "providers/ShowMenuProvider";

import styles from '../NavForm.module.scss';

type LoginType = {
  email: string;
  password: string;
};

const initialValues = {
  email: '',
  password: '',
};

export const Login = ({ data }: any) => {
  const { isLogin, showLoginForm } = useContext(NavFormContext);
  const { showUser } = useContext(StatusLoginContext);
  const { showMenu } = useContext(ShowMenuContext);
  
  const hideMenuLogin = () => {
    showLoginForm();
    showMenu();
  };
  
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const { push } = useRouter();

  
  // @ts-ignore
  const submitAccountData = async ({ email, password }: LoginType, { resetForm }) => {
    try {
      await signIn(email, password);
      
      resetForm(initialValues);
      // @ts-ignore
      setValuesFields(`${data.user.pseudonym}${data?.NavForm?.statusLogin}`);
      await push('/app');
      return showUser();
    } catch (error) {
      setErrorMessage(data?.NavForm?.setErrorMessageLogin);
    }
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
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, data?.NavForm?.validatePasswordHKik)
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
        
        {!!valuesFields && <p className={styles.success__info}>{valuesFields}</p>}
        
        {!!errorMessage && <p className={styles.error}>{errorMessage}</p>}
        
        <button className={`button ${styles.forgotten}`} onClick={forgotten__password}>I forgot my password</button>
        
        <p className={styles.separator}>__________________</p>
        
        <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>
        
        <Providers />
      
      </Form>
    </Formik>
  );
};

