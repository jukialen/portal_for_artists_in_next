'use client';

import { useContext } from 'react';
import axios from 'axios';
import { Button, Input, Select, Textarea, useToast } from '@chakra-ui/react';
import { SchemaValidation } from 'src/shemasValidation/schemaValidation';
import * as Yup from 'yup';

import { useI18n, useScopedI18n } from 'src/locales/client';

import { ResetFormType } from 'src/types/global.types';

import { Form, Formik } from 'formik';

import { initialValuesForContact } from 'src/constants/objects';
import { darkMode } from 'src/constants/links';

import { ModeContext } from 'src/providers/ModeProvider';
import { FormError } from 'src/components/molecules/FormError/FormError';

import styles from './ContactForm.module.scss';

type ContactType = {
  title: string;
  message: string;
  tags: string;
};

export const ContactForm = () => {
  const { isMode } = useContext(ModeContext);

  const t = useI18n();
  const tContact = useScopedI18n('Contact');

  const toast = useToast();

  const schemaValidation = Yup.object({
    title: SchemaValidation().description,
    message: SchemaValidation().description,
    tags: SchemaValidation().contactType,
  });

  const sendFeedback = async ({ title, message, tags }: ContactType, { resetForm }: ResetFormType) => {
    const messages = await axios.post(`${process.env.NEXT_PUBLIC_PAGE}/api/contact`, {
      tags,
      title,
      message,
    });

    console.log(message);
    console.log(message.split('\n').join(''));
    console.log(message.split('\n'));

    messages.status === 200
      ? toast({
          description: tContact('success'),
          status: 'success',
          variant: 'subtle',
          duration: 9000,
        })
      : toast({
          description: tContact('fail'),
          status: 'error',
          variant: 'subtle',
          duration: 9000,
        });

    await resetForm(initialValuesForContact);
  };

  return (
    <Formik initialValues={initialValuesForContact} validationSchema={schemaValidation} onSubmit={sendFeedback}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={isMode === darkMode ? styles.form__dark : styles.form}>
          <div className={isMode === darkMode ? styles.select__dark : styles.select}>
            <Select
              name="tags"
              value={values.tags}
              onChange={handleChange}
              className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}
              placeholder={tContact('chooseTitle')}>
              <option role="option" value={tContact('suggestion')}>
                {tContact('suggestion')}
              </option>
              <option role="option" value={tContact('problem')}>
                {tContact('problem')}
              </option>
            </Select>
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
        </Form>
      )}
    </Formik>
  );
};
