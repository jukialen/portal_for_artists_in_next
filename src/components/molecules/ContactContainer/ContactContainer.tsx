'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Input, NativeSelectField, NativeSelectRoot, Textarea } from '@chakra-ui/react';

import { useI18n, useScopedI18n } from 'locales/client';

import { backUrl } from 'constants/links';
import { initialValuesForContact } from 'constants/objects';
import { ResetFormType, UserType } from 'types/global.types';

import { FormError } from 'components/atoms/FormError/FormError';
import { Button } from 'components/ui/button';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './ContactContainer.module.scss';

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

    console.log(message);
    console.log(message.split('\n').join(''));
    console.log(message.split('\n'));

    messages.status === 200 ? setValuesFields(tContact('success')) : setValuesFields(tContact('fail'));

    await resetForm(initialValuesForContact);
  };

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
          {({ values, handleChange, errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.select}>
                <NativeSelectRoot
                  onChange={handleChange}
                  className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}>
                  <NativeSelectField
                    name="tags"
                    value={values.tags}
                    placeholder={tContact('chooseTitle')}
                    onChange={() => console.log('mmm')}>
                    <option role="option" value={tContact('suggestion')}>
                      {tContact('suggestion')}
                    </option>
                    <option role="option" value={tContact('problem')}>
                      {tContact('problem')}
                    </option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </div>

              <FormError nameError="tags" />

              <Input
                name="title"
                value={values.title}
                onChange={handleChange}
                className={!!errors.title && touched.title ? styles.titleInput__error : ''}
                placeholder={tContact('titleInput')}
              />

              <FormError nameError="title" />

              <Textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                className={!!errors.message && touched.message ? styles.message_error : ''}
                placeholder={tContact('message')}
              />

              <FormError nameError="message" />

              <Button
                colorScheme="blue"
                type="submit"
                variant="outline"
                className={styles.button}
                aria-label={tContact('ariaSend')}>
                {t('AnotherForm.send')}
              </Button>

              {!!valuesFields && <Alerts valueFields={valuesFields} />}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
