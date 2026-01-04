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

import { usePaddle } from 'helpers/Paddle/paddle.client';

import { backUrl } from 'constants/links';
import {
  BillingCycleType,
  Plan,
  SubscriptionPricingType,
  ResetFormType,
  UserFormType,
  UserType,
} from 'types/global.types';

import { FormError } from 'components/ui/atoms/FormError/FormError';

const Alerts = lazy(() =>
  import('components/ui/atoms/Alerts/Alerts').then((a) => ({
    default: a.Alerts,
  })),
);

import styles from './AccountData.module.scss';
import { cycles, plans } from 'constants/values';

type ResetPassword = {
  email: string;
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

type SubscriptionType = {
  newPlan: Plan;
  billCycle: BillingCycleType | null;
};

export const AccountData = ({
  userData,
  subscriptionsOptionsList,
}: {
  userData: UserType;
  subscriptionsOptionsList?: SubscriptionPricingType[];
}) => {
  const t = useI18n();
  const tAccount = useScopedI18n('Account');

  const initialValues = { email: userData?.email || '' };
  const initialPlan = { newPlan: userData?.plan!, billCycle: null };
  const initialValuesPass = {
    email: initialValues.email,
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  };

  const [valuesFields, setValuesFields] = useState('');
  const [valuesFieldsPass, setValuesFieldsPass] = useState('');
  const [valuesFieldsPlan, setValuesFieldsPlan] = useState('');
  const [open, setOpen] = useState(false);

  const { push } = useRouter();
  const paddle = usePaddle();

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

  const changeSubscription = async ({ newPlan, billCycle }: SubscriptionType, { resetForm }: ResetFormType) => {
    try {
      console.log('newPlan', newPlan);
      console.log('plan', userData?.plan!);

      if (!billCycle) {
        setValuesFieldsPlan(t('error'));
        return;
      }

      const selectedPlanForPriceId = subscriptionsOptionsList!.find(
        (p) => p.name.includes(newPlan) && p.billingCycle.includes(billCycle),
      )?.id;

      console.log('selectedPlanForPriceId', selectedPlanForPriceId);

      console.log('paddle', paddle);

      paddle.openSubscriptionCheckout(selectedPlanForPriceId!, userData?.id!, userData?.email, '/settings');

      // console.log('error', error);
      // if (!!error) {
      //   setValuesFieldsPlan(t('error'));
      //   return;
      // }

      // setSubscriptionPlan({ newPlan, billCycle });
      resetForm(initialPlan);
      setOpen(false);
    } catch (e) {
      console.error('e', e);
      setValuesFieldsPlan(t('error'));
    }
  };

  return (
    <article id="account__data" className={styles.account__data}>
      <div className={styles.form}>
        <h3 className={styles.title}>{tAccount('aData.subscription')}</h3>
        <div className={styles.flow}>
          <div className={styles.subscription}>{userData?.plan!}</div>
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
              <Popover.Title className={styles.titleSubscription}>{tAccount('aData.Premium.header')}</Popover.Title>
              <Popover.Description>
                <div className={styles.selectSub}>
                  <Formik
                    initialValues={initialPlan}
                    onSubmit={(values, formikBag) =>
                      changeSubscription(
                        { newPlan: values.newPlan, billCycle: values.billCycle },
                        { resetForm: formikBag.resetForm },
                      )
                    }
                    validateOnChange>
                    {({ errors, touched }) => (
                      <Form>
                        <Field
                          as="select"
                          name="newPlan"
                          className={touched.newPlan && !!errors.newPlan ? styles.req__error : ''}>
                          {plans.map((l, key) => (
                            <option key={key} role="option" value={l} disabled={l === userData?.plan!}>
                              {l}
                            </option>
                          ))}
                        </Field>
                        {touched.newPlan && !!errors.newPlan && (
                          <p className={styles.selectSub__error}>{tAccount('aData.Premium.select__error')}</p>
                        )}
                        <Field
                          as="select"
                          name="billCycle"
                          className={touched.billCycle && !!errors.billCycle ? styles.req__error : ''}>
                          {cycles.map((l, key) => (
                            <option key={key} role="option" value={l}>
                              {l}
                            </option>
                          ))}
                        </Field>
                        {touched.billCycle && !!errors.billCycle && (
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
