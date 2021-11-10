import { FC, useCallback, useContext, useState } from 'react';
import axios from 'axios';

import { FormError } from 'components/molecules/FormError/FormError';
import { FormField } from 'components/molecules/FormField/FormField';
import { Providers } from 'components/molecules/Providers/Providers';

import styles from '../NavForm.module.scss';

import { NavFormContext } from 'providers/NavFormProvider';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  username: '', pseudonym: '', email: '', password: '',
};

type UserDataType = {
  username: string; pseudonym: string; email: string; password: string;
};

// @ts-ignore
export const Create: FC = () => {
  const { isCreate } = useContext(NavFormContext);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valuesFields, setValuesFields] = useState<boolean>(false);
  
  const submitAccountData = useCallback(async ({
    username,
    pseudonym,
    email,
    password
  }: UserDataType, { resetForm }) => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_CREATE_USER}`, {
        username, pseudonym, email, password,
      },);
      setValuesFields(!valuesFields);
      // @ts-ignore
      resetForm(initialValues);
    } catch (error) {
      setErrorMessage('Nie mogliśmy Cię zarejestrować');
    }
    setIsLoading(false);
  }, [valuesFields],);
  
  // @ts-ignore
  return (<Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      username: Yup.string()
      .matches(/^[A-Z]/g, 'Pierwsza litera musi być duża.')
      .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, 'Imię przyjmuje tylko litery. Mogą to być znaki Hiragany, Katakany i kanji',)
      .matches(/\D/g, 'Imię nie może zawierać cyfr')
      .min(3, 'Imię jest za krótkie.')
      .required('Required'),
      
      pseudonym: Yup.string()
      .matches(/[0-9０-９]+/g, 'Pseudonym musi mieć conajmniej 1 cyfrę.')
      .matches(/[#?!@$%^&*-]+/g, 'Pseudonym musi zawierać conajmniej 1 znak specjalny: #?!@$%^&*-',)
      .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, 'Pseudonym przyjmuje tylko litery. Mogą to być znaki Hiragany, Katakany i kanji',)
      .min(5, 'Pseudonym jest za krótkie.')
      .max(15, 'Pseudonym jest za długi. Maksymalnie musi mieć 15 znaków.')
      .required('Required'),
      
      email: Yup.string().email('Invalid email address').required('Required'),
      
      password: Yup.string()
      .min(9, 'Hasło jest za krótkie. Minimum 9 znaków')
      .matches(/[A-Z]+/g, 'Hasło musi zawierać conajmniej jedną dużą literę')
      .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, 'Hasło przyjmuje tylko litery. Mogą to być znaki Hiragany, Katakany i kanji',)
      .matches(/[0-9]+/g, 'Hasło musi mieć conajmniej 1 cyfrę.')
      .matches(/[#?!@$%^&*-]+/g, 'Hasło musi zawierać conajmniej 1 znak specjalny: #?!@$%^&*-')
      .required('Required'),
    })}
    onSubmit={submitAccountData}
  >
    <Form className={`${styles.create__account} ${isCreate ? styles.form__menu__active : ''}`}>
      <h2 className={styles.title}>Zarejestruj się za darmo!</h2>
      
      <FormField
        titleField='Imię:'
        nameField='username'
        typeField='text'
        placeholderField='Name'
      />
      
      <FormError className={styles.error} nameError='username' />
      
      <FormField
        titleField='Pseudonim:'
        nameField='pseudonym'
        typeField='text'
        placeholderField='Pseudonym'
      />
      
      <FormError className={styles.error} nameError='pseudonym' />
      
      <FormField
        titleField='E-mail:'
        nameField='email'
        typeField='email'
        placeholderField='E-mail'
      />
      
      <FormError className={styles.error} nameError='email' />
      
      <FormField
        titleField='Hasło:'
        nameField='password'
        typeField='password'
        placeholderField='Password'
      />
      
      <FormError className={styles.error} nameError='password' />
      
      <button
        type='submit'
        className={`button ${styles.submit__button}`}
        aria-label='login button'
      >
        {isLoading ? 'Rejestruję Cię...' : 'Zarejestruj się'}
      </button>
      
      {valuesFields ? (<p className={styles.success__info}>
        Gratulacje! Zostałeś zarejestrowany. Sprawdź skrzynkę mailową i potwierdź e-mail, aby
        móc się zalogować.
      </p>) : null}
      
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
      
      <p className={styles.separator}>__________________</p>
      
      <h4 className={styles.provider__title}>Lub zarejestruj się za pomocą:</h4>
      
      <Providers />
    </Form>
  </Formik>);
};
