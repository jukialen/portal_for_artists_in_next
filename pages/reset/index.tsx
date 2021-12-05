import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormField } from "components/molecules/FormField/FormField";
import { FormError } from "components/molecules/FormError/FormError";

import styles from "./index.module.scss";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";

type ResetType = {
  password: string;
};

const initialValues = {
  password: '',
};

export default function Reset({ password }: ResetType, { resetForm }: any) {
  const [valuesFields, setValuesFields] = useState<string>('');
  
  const { locale, push } = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data } = useSWR(`/languages/${locale}.json`, fetcher);
  
  const reset__password = async ({ password }: ResetType, { resetForm }: any) => {
   try {
     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
       code: 'privateCode', // code contained in the reset link of step 3.
       password: 'userNewPassword',
       passwordConfirmation: 'userNewPassword',
     })
     resetForm(initialValues);
     setValuesFields('Hasło zostało zmienione pomyślnie! Możesz teraz zalogować się nowym hasłem.')
     setTimeout(() => push('/'), 800);
   } catch (error) {
     console.log('Error:', error)
  }
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        password: Yup.string()
        .min(9, data?.NavForm?.validatePasswordNum)
        .matches(/[A-Z]+/g, data?.NavForm?.validatePasswordOl)
        .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]/g, data?.NavForm?.validatePasswordHKik)
        .matches(/[0-9]+/g, data?.NavForm?.validatePasswordOn)
        .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePasswordSpec)
        .required(data?.NavForm.validateRequired),
      })}
      onSubmit={reset__password}
    >
      <Form className={styles.login}>
        <h2 className={styles.title}>{data?.NavForm?.titleOfLogin}</h2>
        
        <FormField
          titleField={`${data?.NavForm?.password}:`}
          nameField='nav__password'
          typeField='nav__password'
          placeholderField={data?.Account?.newPassword}
        />
        
        <FormError className={styles.error} nameError='nav__password' />
  
        <FormField
          titleField={`${data?.NavForm?.password}:`}
          nameField='nav__password'
          typeField='nav__password'
          placeholderField={data?.Account?.againNewPassword}
        />
  
        <FormError className={styles.error} nameError='nav__password' />
        
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label='button for changing password'
        >
          {data?.Account?.changePassword}
        </button>
        
        {!!valuesFields && <p className={styles.success__info}>{valuesFields}</p>}
      </Form>
    </Formik>
  );
};
}