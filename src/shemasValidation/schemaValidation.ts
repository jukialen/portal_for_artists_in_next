import * as Yup from 'yup';
import { useI18n, useScopedI18n } from 'locales/client';

import { Tags } from 'types/global.types';

export const SchemaValidation = () => {
  const t = useI18n();
  const ts = useScopedI18n('NavForm');

  const username = Yup.string()
    .matches(/^[A-Z]/g, ts('validateUsernameFl'))
    .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, ts('validateUsernameHKik'))
    .matches(/\D/g, ts('validateUsernameNum'))
    .min(3, ts('validateUsernameMin'))
    .required(ts('validateRequired'));

  const pseudonym = Yup.string()
    .matches(/[0-9０-９]+/g, ts('validatePseudonymNum'))
    .matches(/[#?!@$%^&*-＃？！＄％＆＊ー]+/g, ts('validatePseudonymSpec'))
    .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, ts('validatePseudonymHKik'))
    .min(5, ts('validatePseudonymMin'))
    .max(15, ts('validatePseudonymMax'))
    .required(ts('validateRequired'));

  const email = Yup.string().email(ts('validateEmail')).required(ts('validateRequired'));

  const password = Yup.string()
    .min(9, ts('validatePasswordNum'))
    .matches(/[A-Z]+/g, ts('validatePasswordOl'))
    .matches(/[a-ząćęłńóśźżĄĘŁŃÓŚŹŻぁ-んァ-ヾ一-龯]*/g, ts('validatePasswordHKik'))
    .matches(/[0-9]+/g, ts('validatePasswordOn'))
    .matches(/[#?!@$%^&*-]+/g, ts('validatePasswordSpec'))
    .required(ts('validateRequired'));

  const description = Yup.string().required(ts('validateRequired'));

  const tags = Yup.mixed().oneOf(Object.values(Tags)).required(ts('validateRequired'));

  const contactType = Yup.string()
    .equals(
      [t('Contact.suggestion'), t('Contact.problem')],
      `Tag must be ${t('Contact.suggestion')} or ${t('Contact.suggestion')}`,
    )
    .required(ts('validateRequired'));

  const groupName = Yup.string()
    .required(ts('validateRequired'))
    .min(5, 'Group name is too short.')
    .max(20, 'Group name is too long.');
  // .matches(/![#?!@$%^&*-]/g, 'Group name haven\'ts to include special characters.');

  const shortDescription = Yup.string().max(100, 'Description cannot be longer than 100 characters.');

  return {
    username,
    pseudonym,
    email,
    password,
    description,
    tags,
    contactType,
    groupName,
    shortDescription,
  };
};
