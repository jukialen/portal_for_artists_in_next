'use client';

import { useContext, useState } from 'react';
import { Link } from '@chakra-ui/next-js';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
import { useCurrentLocale, useI18n, useScopedI18n } from 'locales/client';

import { NewPlanType, ResetFormType, UserFormType, UserType } from "types/global.types";

import { darkMode } from 'constants/links';

import { backUrl } from 'constants/links';

import { ModeContext } from 'providers/ModeProvider';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './AccountData.module.scss';

const initialValues = { email: '' };

// @ts-ignore
const initialPlan: NewPlanType | string | number | readonly string[] | undefined = { newPlan: '' };

const initialValuesPass = {
  oldPassword: '',
  newPassword: '',
  repeatNewPassword: '',
};

type ResetPassword = {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

type SubscriptionType = {
  newPlan: NewPlanType;
};

type PlanType =  NewPlanType | 'FREE' | "PREMIUM" | "GOLD";

export const AccountData = ({ userData }: { userData: UserType }) => {
  const locale = useCurrentLocale();
  const t = useI18n();
  const tAccount = useScopedI18n('Account');

  const [valuesFields, setValuesFields] = useState('');
  const [valuesFieldsPass, setValuesFieldsPass] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<PlanType>(userData?.plan || 'FREE' );
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { isMode } = useContext(ModeContext);
  const { push } = useRouter();

  const schemaEmail = Yup.object({
    email: SchemaValidation().email,
  });
  const schemaValidation = Yup.object({
    oldPassword: SchemaValidation().password,
    newPassword: SchemaValidation().password,
    repeatNewPassword: SchemaValidation().password,
  });

  const schemaSubscription = Yup.object({
    plan: SchemaValidation().tags,
  });

  const update__email = async ({ email }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      resetForm(initialValues);
      await axios.patch(`${backUrl}/auth/change-email`, { user_id: userData?.id, newEmail: email });
      setValuesFields(t('Forgotten.success'));
      push(`${locale}/`);
    } catch (e) {
      console.error(e);
      setValuesFields(t('error'));
    }
  };

  const newPassword = async (
    { oldPassword, newPassword, repeatNewPassword }: ResetPassword,
    { resetForm }: ResetFormType,
  ) => {
    try {
      if (newPassword !== repeatNewPassword) {
        setValuesFieldsPass(t('PasswordAccount.differentPasswords'));
        return;
      }

      await axios.post(`${backUrl}/auth/change-password`, { oldPassword, newPassword });
      resetForm(initialValues);
      setValuesFieldsPass(t('PasswordAccount.success'));
    } catch (e) {
      console.error(e);
      setValuesFieldsPass(t('error'));
    }
  };

  const changeSubscription = async ({ newPlan }: SubscriptionType, { resetForm }: ResetFormType) => {
    try {
      await axios.patch(`${backUrl}/users/${userData?.pseudonym}`, { plan: newPlan });
      setSubscriptionPlan(newPlan);
      await resetForm(initialPlan);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="account__data" className={styles.account__data}>
      <div className={styles.form}>
        <h3 className={styles.title}>{tAccount('aData.subscription')}</h3>
        <div className={styles.flow}>
          <div className={styles.subscription}>{subscriptionPlan.toString()}</div>
          <Popover isLazy isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <PopoverTrigger>
              <Button className={`button ${styles.planButton}`} aria-label="Change subscription">
                {tAccount('aData.changeButton')}
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                borderColor={isMode === darkMode ? 'gray.600' : 'gray.100'}
                className={isMode === darkMode ? styles.subscription__dark : styles.subscription}>
                <PopoverArrow
                  boxShadow={
                    isMode === darkMode
                      ? '-1px -1px 1px 0 var(--chakra-colors-gray-600)'
                      : '-1px -1px 1px 0 var(--chakra-colors-gray-100)'
                  }
                  className={styles.arrow}
                />
                <PopoverHeader>{tAccount('aData.Premium.header')}</PopoverHeader>
                <PopoverCloseButton className={styles.closeButton} />
                <PopoverBody>
                  <div className={isMode === darkMode ? styles.selectSub__dark : styles.selectSub}>
                    <Formik
                      // @ts-ignore
                      initialValues={initialPlan}
                      validationSchema={schemaSubscription}
                      onSubmit={changeSubscription}>
                      {({ values, handleChange, errors, touched }) => (
                        <Form>
                          <Select
                            name="newPlan"
                            // @ts-ignore
                            value={values.newPlan}
                            onChange={handleChange}
                            focusBorderColor={touched.newPlan && !!errors.newPlan ? 'red.500' : 'blue.500'}
                            className={touched.newPlan && !!errors.newPlan ? styles.req__error : ''}>
                            <option role="option" value="">
                              {t('Plans.choosePlan')}
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
                          {touched.newPlan && !!errors.newPlan && (
                            <p className={styles.selectSub__error}>{tAccount('aData.Premium.select__error')}</p>
                          )}
                          <p className={styles.message}>
                            {tAccount('aData.Premium.body')}
                            <Link href={`${locale}/plans`}>{tAccount('aData.Premium.bodyLink')}</Link>
                            {tAccount('aData.Premium.bodyDot')}
                          </p>
                          <ButtonGroup
                            size="sm"
                            className={`${styles.buttonContainer} ${
                              isMode === darkMode ? styles.buttonContainer__dark : ''
                            }`}>
                            <Button
                              variant="ghost"
                              className={`${isMode === darkMode ? styles.buttonContainer__dark : ''}`}
                              _hover={{ backgroundColor: isMode === darkMode ? 'gray.600' : 'gray.300' }}
                              onClick={onClose}>
                              {t('cancel')}
                            </Button>
                            <Button type="submit" colorScheme="blue">
                              {tAccount('aData.Premium.update')}
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
      </div>

      {userData?.provider === 'email' && (
        <>
          <Formik initialValues={initialValues} validationSchema={schemaEmail} onSubmit={update__email}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={`${styles.form} ${isMode === darkMode ? styles.form_dark : ''}`}>
                <h3 className={styles.title}>{t('NavForm.email')}</h3>
                <Input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder={userData?.email}
                  className={touched.email && !!errors.email ? styles.input__error : styles.input}
                />
                <FormError nameError="email" />
                <button className={`${styles.button} button`} type="submit" aria-label="E-mail address change">
                  {tAccount('aData.changeEmail')}
                </button>
                {!!valuesFields && <Alerts valueFields={valuesFields} />}
              </Form>
            )}
          </Formik>

          <Formik initialValues={initialValuesPass} validationSchema={schemaValidation} onSubmit={newPassword}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={`${styles.form} ${isMode === darkMode ? styles.form_dark : ''}`}>
                <h3 className={styles.title}>{t('NavForm.password')}</h3>
                <Input
                  name="oldPassword"
                  type="password"
                  value={values.oldPassword}
                  onChange={handleChange}
                  placeholder={tAccount('aData.oldPassword')}
                  className={touched.oldPassword && !!errors.oldPassword ? styles.input__error : styles.input}
                />
                <FormError nameError="oldPassword" />
                <Input
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  placeholder={tAccount('aData.newPassword')}
                  className={touched.newPassword && !!errors.newPassword ? styles.input__error : styles.input}
                />
                <FormError nameError="newPassword" />
                <Input
                  name="repeatNewPassword"
                  type="password"
                  value={values.repeatNewPassword}
                  onChange={handleChange}
                  placeholder={tAccount('aData.againNewPassword')}
                  className={
                    touched.repeatNewPassword && !!errors.repeatNewPassword ? styles.input__error : styles.input
                  }
                />
                <FormError nameError="repeatNewPassword" />
                <button className="button" type="submit" aria-label={t('PasswordAccount.buttonAria')}>
                  {tAccount('aData.changePassword')}
                </button>

                {!!valuesFieldsPass && <Alerts valueFields={valuesFieldsPass} />}
              </Form>
            )}
          </Formik>
        </>
      )}
    </article>
  );
};
