import * as Yup from 'yup';
import { useHookSWR } from '../hooks/useHookSWR';

export const SchemaValidation = () => {
  const data = useHookSWR();
  
  const username = Yup.string()
  .matches(/^[A-Z]/g, data?.NavForm?.validateUsernameFl)
  .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validateUsernameHKik)
  .matches(/\D/g, data?.NavForm?.validateUsernameNum)
  .min(3, data?.NavForm?.validateUsernameMin)
  .required(data?.NavForm?.validateRequired);
  
  const pseudonym = Yup.string()
  .matches(/[0-9０-９]+/g, data?.NavForm?.validatePseudonymNum)
  .matches(/[#?!@$%^&*-＃？！＄％＆＊ー]+/g, data?.NavForm?.validatePseudonymSpec)
  .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validatePseudonymHKik)
  .min(5, data?.NavForm?.validatePseudonymMin)
  .max(15, data?.NavForm?.validatePseudonymMax)
  .required(data?.NavForm?.validateRequired);
  
  const email = Yup.string()
  .email('Invalid email')
  .required(data?.NavForm?.validateRequired);
  
  const password = Yup.string()
  .min(9, data?.NavForm?.validatePasswordNum)
  .matches(/[A-Z]+/g, data?.NavForm?.validatePasswordOl)
  .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, data?.NavForm?.validatePasswordHKik)
  .matches(/[0-9]+/g, data?.NavForm?.validatePasswordOn)
  .matches(/[#?!@$%^&*-]+/g, data?.NavForm?.validatePasswordSpec)
  .required(data?.NavForm?.validateRequired);
  
  const description = Yup.string()
    .required(data?.NavForm?.validateRequired);
  
  const tags = Yup.string().required(data?.NavForm?.validateRequired);
  
  return {
    username,
    pseudonym,
    email,
    password,
    description,
    tags
  };
};
