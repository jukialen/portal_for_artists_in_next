'use client';

import { useContext, useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button, Input, Textarea } from '@chakra-ui/react';
import { NativeSelectField, NativeSelectRoot } from 'components/ui/native-select';

import { useI18n, useScopedI18n } from 'locales/client';

import { initialValuesForContact } from 'constants/objects';
import { backUrl } from "constants/links";
import { ResetFormType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './ContactForm.module.scss';

type ContactType = {
  title: string;
  message: string;
  tags: string;
};

export const ContactForm = () => {
  const [valuesFields, setValuesFields] = useState<string>('');

  const { isMode } = useContext(ModeContext);

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
    <Formik initialValues={initialValuesForContact} validationSchema={schemaValidation} onSubmit={sendFeedback}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.select}>
            <NativeSelectRoot
              onChange={handleChange}
              className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}>
              <NativeSelectField name="tags" value={values.tags} placeholder={tContact('chooseTitle')} onChange={() => console.log('mmm')}>
                <option role="option" value={tContact('suggestion')} >
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
  );
};
