'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Select, createListCollection } from '@ark-ui/react/select';

import { useI18n, useScopedI18n } from 'locales/client';

import { backUrl } from 'constants/links';
import { initialValuesForContact } from 'constants/objects';
import { ResetFormType, UserType } from 'types/global.types';

import { FormError } from 'components/ui/atoms/FormError/FormError';
import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './ContactContainer.module.scss';
import { LuChevronDown } from 'react-icons/lu';

type ContactType = {
  title: string;
  message: string;
  tags: string;
};

type ContactContainerType = { userData: UserType };
export const ContactContainer = ({ userData }: ContactContainerType) => {
  const [valuesFields, setValuesFields] = useState<string>('');

  const t = useI18n();
  const tContact = useScopedI18n('Contact');

  const schemaValidation = Yup.object({
    title: SchemaValidation().description,
    message: SchemaValidation().description,
    tags: SchemaValidation().contactType,
  });

  const sendFeedback = async ({ title, message, tags }: ContactType, { resetForm }: ResetFormType) => {
    const messages = await axios.post(`${backUrl}/api/contact`, {
      tags,
      title,
      message,
    });

    messages.status === 200 ? setValuesFields(tContact('success')) : setValuesFields(tContact('fail'));

    await resetForm(initialValuesForContact);
  };

  const collection = [
    { value: '', name: t('chooseTag') },
    { value: 'Suggestion', name: tContact('suggestion') },
    { value: 'Problem', name: tContact('problem') },
  ];

  return (
    <div className={userData?.pseudonym ? styles.site__without__footer : styles.site}>
      <div className={styles.container}>
        <div className={styles.welcomeContainer}>
          <h2 className={styles.title}>{tContact('title')}</h2>

          <p className={styles.subTitle}>{tContact('subTitleFirst')}</p>

          <p>
            {tContact('toFAQ')}
            <Link href="/faq">{tContact('toFAQHere')}</Link>
            {tContact('dot')}
          </p>
        </div>
        <Formik initialValues={initialValuesForContact} validationSchema={schemaValidation} onSubmit={sendFeedback}>
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.select}>
                <select
                  name="tags"
                  value={values.tags}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}>
                  {collection.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <FormError nameError="tags" />

              <input
                name="title"
                value={values.title}
                onChange={handleChange}
                className={!!errors.title && touched.title ? styles.titleInput__error : styles.titleInput}
                placeholder={tContact('titleInput')}
              />

              <FormError nameError="title" />

              <textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                className={!!errors.message && touched.message ? styles.message_error : styles.message}
                placeholder={tContact('message')}
              />

              <FormError nameError="message" />

              <button type="submit" className={styles.button} aria-label={tContact('ariaSend')}>
                {t('AnotherForm.send')}
              </button>

              {!!valuesFields && <Alerts valueFields={valuesFields} />}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
