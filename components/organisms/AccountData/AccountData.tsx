import { useContext, useEffect, useState } from 'react';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import {
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  useDisclosure,
} from '@chakra-ui/react';

import { DataType, FormType, UserDataType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './AccountData.module.scss';
import Link from 'next/link';
import { getDoc, setDoc } from 'firebase/firestore';
import { user } from 'references/referencesFirebase';

const initialValues = {
  email: '',
};

const initialPlan = {
  plan: '',
};

const initialValuesPass = {
  newPassword: '',
  repeatNewPassword: '',
};

type ResetPassword = {
  newPassword: string;
  repeatNewPassword: string;
};

type SubscriptionType = {
  plan: string;
};

export const AccountData = ({ data }: DataType) => {
  const [valuesFields, setValuesFields] = useState<string>('');
  const [valuesFieldsPass, setValuesFieldsPass] = useState<string>('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('FREE');
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { isMode } = useContext(ModeContext);

  const auth = getAuth();
  auth.useDeviceLanguage();
  const currentUser = auth.currentUser!;

  const schemaValidation = Yup.object({
    newPassword: SchemaValidation().password,
    repeatNewPassword: SchemaValidation().password,
  });

  const schemaSubscription = Yup.object({
    plan: SchemaValidation().tags,
  });

  const getPlan = async () => {
    try {
      const docSnap = await getDoc(user(currentUser.uid));

      docSnap.exists() ? setSubscriptionPlan(docSnap.data().plan) : console.log('No plan!');
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    !!currentUser && getPlan();
  }, [currentUser]);

  const update__email = async ({ email }: UserDataType, { resetForm }: FormType) => {
    try {
      await updateEmail(auth.currentUser!, email!);
      resetForm(initialValues);
      setValuesFields(data?.Forgotten?.success);
    } catch (e) {
      console.error(e);
      setValuesFields(data?.error);
    }
  };

  const newPassword = async ({ newPassword, repeatNewPassword }: ResetPassword, { resetForm }: FormType) => {
    try {
      if (newPassword !== repeatNewPassword) {
        setValuesFieldsPass(data?.PasswordAccount?.differentPasswords);
        return;
      }

      await updatePassword(currentUser, newPassword);
      resetForm(initialValues);
      setValuesFieldsPass(data?.PasswordAccount?.success);
    } catch (e) {
      console.error(e);
      setValuesFieldsPass(data?.error);
    }
  };

  const changeSubscription = async ({ plan }: SubscriptionType, { resetForm }: FormType) => {
    try {
      if (plan !== undefined) {
        await setDoc(user(currentUser.uid), { plan }, { merge: true });
        await setSubscriptionPlan(plan!);
        await resetForm(initialPlan);
        await onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="account__data" className={styles.account__data}>
      <div className={styles.form}>
        <p className={styles.title}>{data?.Account?.aData?.subscription}</p>
        <div className={styles.subscription}>{subscriptionPlan}</div>
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
          <PopoverTrigger>
            <button className={`${styles.button} button`} aria-label="Change subscription">
              {data?.Account?.aData?.changeButton}
            </button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              borderColor={isMode ? 'gray.600' : 'gray.100'}
              className={isMode ? styles.subscription__dark : styles.subscription}>
              <PopoverArrow
                boxShadow={
                  isMode
                    ? '-1px -1px 1px 0 var(--chakra-colors-gray-600) !important'
                    : '-1px -1px 1px 0 var(--chakra-colors-gray-100) !important'
                }
                className={styles.arrow}
              />
              <PopoverHeader>{data?.Account?.aData?.Premium?.header}</PopoverHeader>
              <PopoverCloseButton className={styles.closeButton} />
              <PopoverBody>
                <div className={isMode ? styles.selectSub__dark : styles.selectSub}>
                  <Formik
                    initialValues={initialPlan}
                    validationSchema={schemaSubscription}
                    onSubmit={changeSubscription}>
                    {({ values, handleChange, errors, touched }) => (
                      <Form>
                        <Select
                          name="plan"
                          value={values.plan}
                          onChange={handleChange}
                          focusBorderColor={touched.plan && !!errors.plan ? 'red.500' : 'blue.500'}
                          className={touched.plan && !!errors.plan ? styles.req__error : ''}>
                          <option role="option" value="">
                            {data?.Pricing?.choosePlan}
                          </option>
                          <option role="option" value="FREE">
                            FREE
                          </option>
                          <option role="option" value="PREMIUM">
                            PREMIUM
                          </option>
                          <option role="option" value="GOLD">
                            GOLD
                          </option>
                        </Select>
                        {touched.plan && !!errors.plan && (
                          <p className={styles.selectSub__error}>{data?.Account?.aData?.Premium?.select__error}</p>
                        )}
                        <p className={styles.message}>
                          {data?.Account?.aData?.Premium?.body}
                          <Link href="/plans">
                            <a>{data?.Account?.aData?.Premium?.bodyLink}</a>
                          </Link>
                          {data?.Account?.aData?.Premium?.bodyDot}
                        </p>
                        <ButtonGroup size="sm" className={styles.buttonContainer}>
                          <Button
                            variant="ghost"
                            _hover={{ backgroundColor: isMode ? 'gray.600' : 'gray.100' }}
                            onClick={onClose}>
                            {data?.cancel}
                          </Button>
                          <Button type="submit" colorScheme="blue">
                            {data?.Account?.aData?.Premium?.update}
                          </Button>
                        </ButtonGroup>
                      </Form>
                    )}
                  </Formik>
                </div>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </div>

      <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={update__email}>
        {({ values, handleChange }) => (
          <Form className={styles.form}>
            <label className={styles.title} htmlFor="mail__change">
              {data?.NavForm?.email}
            </label>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={data?.NavForm?.email}
              className={styles.input}
            />
            <FormError nameError="email" />
            <button
              id="mail__change"
              className={`${styles.button} button`}
              type="submit"
              aria-label="E-mail address change">
              {data?.Account?.aData?.changeEmail}
            </button>
            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </Form>
        )}
      </Formik>

      <Formik initialValues={initialValuesPass} validationSchema={schemaValidation} onSubmit={newPassword}>
        {({ values, handleChange }) => (
          <Form className={styles.form}>
            <label className={styles.title} htmlFor="password">
              {data?.NavForm?.password}
            </label>
            <Input
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              placeholder={data?.Account?.aData?.newPassword}
              className={styles.input}
            />
            <FormError nameError="newPassword" />
            <Input
              name="repeatNewPassword"
              type="password"
              value={values.repeatNewPassword}
              onChange={handleChange}
              placeholder={data?.Account?.aData?.againNewPassword}
              className={styles.input}
            />
            <FormError nameError="repeatNewPassword" />
            <button className={`${styles.button} button`} type="submit" aria-label={data?.PasswordAccount?.buttonAria}>
              {data?.Account?.aData?.changePassword}
            </button>

            {!!valuesFieldsPass && <Alerts valueFields={valuesFieldsPass} />}
          </Form>
        )}
      </Formik>
    </article>
  );
};
