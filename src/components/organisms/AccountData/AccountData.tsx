'use client';

import { useState, lazy } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from 'utils/supabase/clientCSR';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { Popover } from '@ark-ui/react/popover';

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
  newPlan: Plan;
};

type PlanType = NewPlanType | Plan;

export const AccountData = ({ userData }: { userData: UserType }) => {
  const t = useI18n();
  const tAccount = useScopedI18n('Account');

  const initialValues = { email: userData?.email || '' };
  const initialPlan = { newPlan: userData?.plan! };
  const initialValuesPass = {
    email: initialValues.email,
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  };

  const [valuesFields, setValuesFields] = useState('');
  const [valuesFieldsPass, setValuesFieldsPass] = useState('');
  const [valuesFieldsPlan, setValuesFieldsPlan] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<PlanType>(userData?.plan!);
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

  const supabase = createClient();

  const update__email = async ({ email }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      if (email !== userData?.email!) {
        const { error } = await supabase.auth.updateUser({ email });
        if (!!error) {
          console.error(error);
          setValuesFields(t('error'));
          return;
        }

        const { error: er } = await supabase.from('Users').update({ email }).eq('id', userData?.id!);
        if (!!er) {
          setValuesFields(t('error'));
          return;
        }
      }
      resetForm(initialValues);
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
      if (newPlan === userData?.plan!) console.log(true);
      const { error } = await supabase.from('Users').update({ plan: newPlan }).eq('id', userData?.id!);

      if (!!error) {
        setValuesFieldsPlan(t('error'));
        return;
      }

      setSubscriptionPlan(newPlan);
      await resetForm(initialPlan);
      setOpen(false);
    } catch (e) {
      setValuesFieldsPlan(t('error'));
    }
  };

  return (
    <article id="account__data" className={styles.account__data}>
      <div className={styles.form}>
        <h3 className={styles.title}>{tAccount('aData.subscription')}</h3>
        <div className={styles.flow}>
          <div className={styles.subscription}>{subscriptionPlan.toString()}</div>
          <Popover.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
            <Popover.Trigger asChild>
              <button className={`button ${styles.planButton}`} aria-label="Change subscription">
                {tAccount('aData.changeButton')}
              </button>
            </Popover.Trigger>
            <Popover.Content className={styles.subscriptionForm}>
              <Popover.Arrow className={styles.arrow} />
              <Popover.Title>{tAccount('aData.Premium.header')}</Popover.Title>
              <Popover.Description>
                <div className={styles.selectSub}>
                  <Formik
                    initialValues={initialPlan}
                    onSubmit={(values, formikBag) =>
                      changeSubscription({ newPlan: values.newPlan }, { resetForm: formikBag.resetForm })
                    }
                    validateOnChange>
                    {({ errors, touched }) => (
                      <Form>
                        <Field
                          as="select"
                          name="newPlan"
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
                        <div className={styles.buttonContainer}>
                          <button onClick={() => setOpen(false)}>{t('cancel')}</button>
                          <button type="submit">{tAccount('aData.Premium.update')}</button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  {!!valuesFieldsPlan && <Alerts valueFields={valuesFieldsPlan} />}
                </div>
              </Popover.Description>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>

      {userData?.provider === 'email' && (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={schemaEmail}
            onSubmit={(values, formikBag) => update__email(values, { resetForm: formikBag.resetForm })}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.form}>
                <h3 className={styles.title}>{t('NavForm.email')}</h3>
                <input
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

          <Formik
            initialValues={initialValuesPass}
            validationSchema={schemaValidation}
            onSubmit={(values, formikBag) => newPassword(values, { resetForm: formikBag.resetForm })}>
            {({ errors, touched }) => (
              <Form className={styles.form}>
                <h3 className={styles.title}>{t('NavForm.password')}</h3>
                <input
                  name="email"
                  type="email"
                  placeholder={userData?.email}
                  className={touched.email && !!errors.email ? styles.input__error : styles.input}
                />
                <FormError nameError="email" />
                <input
                  name="oldPassword"
                  type="password"
                  placeholder={tAccount('aData.oldPassword')}
                  className={touched.oldPassword && !!errors.oldPassword ? styles.input__error : styles.input}
                />
                <FormError nameError="oldPassword" />
                <input
                  name="newPassword"
                  type="password"
                  placeholder={tAccount('aData.newPassword')}
                  className={touched.newPassword && !!errors.newPassword ? styles.input__error : styles.input}
                />
                <FormError nameError="newPassword" />
                <input
                  name="repeatNewPassword"
                  type="password"
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
