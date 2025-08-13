'use client';

import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from 'utils/supabase/clientCSR';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

const Button = lazy(() =>
  import('@chakra-ui/react/button').then((mod) => ({
    default: mod.Button,
  })),
);

const Group = lazy(() =>
  import('@chakra-ui/react/group').then((mod) => ({
    default: mod.Group,
  })),
);

import { Portal } from '@chakra-ui/react/portal';

const Input = lazy(() =>
  import('@chakra-ui/react/input').then((mod) => ({
    default: mod.Input,
  })),
);

import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverRoot,
  PopoverTrigger,
} from 'components/ui/popover';

import { useI18n, useScopedI18n } from 'locales/client';

import { backUrl } from 'constants/links';
import { NewPlanType, Plan, ResetFormType, UserFormType, UserType } from 'types/global.types';

import { FormError } from 'components/atoms/FormError/FormError';

const Alerts = lazy(() =>
  import('../../atoms/Alerts/Alerts').then((a) => ({
    default: a.Alerts,
  })),
);

import styles from './AccountData.module.scss';

type ResetPassword = {
  email: string;
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

type SubscriptionType = {
  newPlan?: Plan;
};

type PlanType = NewPlanType | Plan;

export const AccountData = ({ userData }: { userData: UserType }) => {
  const t = useI18n();
  const tAccount = useScopedI18n('Account');

  const initialValues = { email: userData?.email || '' };
  const initialPlan: NewPlanType = { newPlan: userData?.plan! };

  const initialValuesPass = {
    email: initialValues.email,
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  };

  const [valuesFields, setValuesFields] = useState('');
  const [valuesFieldsPass, setValuesFieldsPass] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<PlanType>(userData?.plan || 'FREE');
  const [open, setOpen] = useState(false);

  const { push } = useRouter();

  const items: Plan[] = ['FREE', 'PREMIUM', 'GOLD'];

  const schemaEmail = Yup.object({
    email: SchemaValidation().email,
  });
  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    oldPassword: SchemaValidation().password,
    newPassword: SchemaValidation().password,
    repeatNewPassword: SchemaValidation().password,
  });
  const schemaSubscription = Yup.object({
    plan: SchemaValidation().tags,
  });

  const supabase = createClient();

  const update__email = async ({ email }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      resetForm(initialValues);
      const { error } = await supabase.auth.updateUser({ email });
      if (!!error) {
        console.error(error);
        setValuesFields(t('error'));
        return;
      }

      const { error: er } = await supabase.from('Users').update({ email }).eq('id', userData?.id!);
      if (!!er) {
        console.error(er);
        setValuesFields(t('error'));
        return;
      }
      setValuesFields(t('Forgotten.success'));
      push('/');
    } catch (e) {
      console.error(e);
      setValuesFields(t('error'));
    }
  };

  const newPassword = async (
    { email, oldPassword, newPassword, repeatNewPassword }: ResetPassword,
    { resetForm }: ResetFormType,
  ) => {
    try {
      if (newPassword !== repeatNewPassword && oldPassword !== newPassword) {
        setValuesFieldsPass(t('PasswordAccount.differentPasswords'));
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${backUrl}/new-password`,
      });

      if (!!error) {
        console.error(error);
        return;
      }

      resetForm(initialValues);
      setValuesFieldsPass(t('PasswordAccount.success'));
    } catch (e) {
      console.error(e);
      setValuesFieldsPass(t('error'));
    }
  };

  const changeSubscription = async ({ newPlan }: SubscriptionType, { resetForm }: ResetFormType) => {
    try {
      const { error } = await supabase.from('Users').update({ plan: newPlan }).eq('id', userData?.id!);

      if (!!error) {
        console.error(error);
        return;
      }

      console.log('newPlan', newPlan);

      setSubscriptionPlan(newPlan!);
      console.log(subscriptionPlan);
      await resetForm(initialPlan);
      setOpen(false);
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
          <PopoverRoot
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
            <PopoverTrigger asChild>
              <Button className={`button ${styles.planButton}`} aria-label="Change subscription">
                {tAccount('aData.changeButton')}
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent className={styles.subscriptionForm}>
                <PopoverArrow className={styles.arrow} />
                <PopoverHeader>{tAccount('aData.Premium.header')}</PopoverHeader>
                <PopoverBody>
                  <div className={styles.selectSub}>
                    <Formik
                      initialValues={initialPlan}
                      validationSchema={schemaSubscription}
                      onSubmit={changeSubscription}
                      validateOnChange>
                      {({ values, handleChange, errors, touched }) => (
                        <Form>
                          <Field
                            as="select"
                            name="newPlan"
                            value={values.newPlan}
                            onChange={handleChange}
                            className={touched.newPlan && !!errors.newPlan ? styles.req__error : ''}>
                            {items.map((l, key) => (
                              <option key={key} role="option" value={l}>
                                {l}
                              </option>
                            ))}
                          </Field>
                          {touched.newPlan && !!errors.newPlan && (
                            <p className={styles.selectSub__error}>{tAccount('aData.Premium.select__error')}</p>
                          )}
                          <div className={styles.message}>
                            {tAccount('aData.Premium.body')}
                            <Link href="/plans">{tAccount('aData.Premium.bodyLink')}</Link>
                            {tAccount('aData.Premium.bodyDot')}
                          </div>
                          <Suspense fallback={<div>Loading...</div>}>
                            <Group className={styles.buttonContainer}>
                              <Button variant="ghost" onClick={() => setOpen(false)}>
                                {t('cancel')}
                              </Button>
                              <Button type="submit">{tAccount('aData.Premium.update')}</Button>
                            </Group>
                          </Suspense>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
            {/*</Suspense>*/}
          </PopoverRoot>
        </div>
      </div>

      {userData?.provider === 'email' && (
        <>
          <Formik initialValues={initialValues} validationSchema={schemaEmail} onSubmit={update__email}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.form}>
                <h3 className={styles.title}>{t('NavForm.email')}</h3>
                <Suspense fallback={<div>Loading...</div>}>
                  <Input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder={userData?.email}
                    className={touched.email && !!errors.email ? styles.input__error : styles.input}
                  />
                </Suspense>
                <FormError nameError="email" />
                <button className={`${styles.button} button`} type="submit" aria-label="E-mail address change">
                  {tAccount('aData.changeEmail')}
                </button>
                <Suspense fallback={<div>Loading...</div>}>
                  {!!valuesFields && <Alerts valueFields={valuesFields} />}
                </Suspense>
              </Form>
            )}
          </Formik>

          <Formik initialValues={initialValuesPass} validationSchema={schemaValidation} onSubmit={newPassword}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.form}>
                <h3 className={styles.title}>{t('NavForm.password')}</h3>
                <Suspense fallback={<div>Loading...</div>}>
                  <Input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder={userData?.email}
                    className={touched.email && !!errors.email ? styles.input__error : styles.input}
                  />
                </Suspense>
                <FormError nameError="email" />
                <Input
                  name="oldPassword"
                  type="password"
                  value={values.oldPassword}
                  onChange={handleChange}
                  placeholder={tAccount('aData.oldPassword')}
                  className={touched.oldPassword && !!errors.oldPassword ? styles.input__error : styles.input}
                />
                <FormError nameError="oldPassword" />
                <Suspense fallback={<div>Loading...</div>}>
                  <Input
                    name="newPassword"
                    type="password"
                    value={values.newPassword}
                    onChange={handleChange}
                    placeholder={tAccount('aData.newPassword')}
                    className={touched.newPassword && !!errors.newPassword ? styles.input__error : styles.input}
                  />
                </Suspense>
                <FormError nameError="newPassword" />
                <Suspense fallback={<div>Loading...</div>}>
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
                </Suspense>
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
