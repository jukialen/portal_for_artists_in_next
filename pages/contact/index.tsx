import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button, Input, Select, Textarea, useToast } from '@chakra-ui/react';

import { ResetFormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { StatusLoginContext } from 'providers/StatusLogin';
import { ModeContext } from 'providers/ModeProvider';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Footer } from 'components/molecules/Footer/Footer';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './index.module.scss';

type ContactType = {
  title: string;
  message: string;
  tags: string;
};

export default function Contact() {
  const { asPath } = useRouter();
  const { isUser } = useContext(StatusLoginContext);
  const { isMode } = useContext(ModeContext);
  const data = useHookSWR();
  const toast = useToast();

  const initialValues = {
    title: '',
    message: '',
    tags: '',
  };

  const schemaValidation = Yup.object({
    title: SchemaValidation().description,
    message: SchemaValidation().description,
    tags: SchemaValidation().tags,
  });

  const sendFeedback = async ({ title, message, tags }: ContactType, { resetForm }: ResetFormType) => {
    const messages = await axios.post(`${process.env.NEXT_PUBLIC_PAGE}/api/contact`, {
      tags,
      title,
      message,
    });

    messages.status === 200
      ? toast({
          description: data?.Contact?.success,
          status: 'success',
          variant: 'subtle',
          duration: 9000,
        })
      : toast({
          description: data?.Contact?.fail,
          status: 'error',
          variant: 'subtle',
          duration: 9000,
        });

    await resetForm(initialValues);
  };

  return (
    <div className={isUser ? styles.site__without__footer : styles.site}>
      <HeadCom path={asPath} content="Site for contact to me." />

      <div className={styles.container}>
        <div className={styles.welcomeContainer}>
          <h2 className={styles.title}>{data?.Contact?.title}</h2>

          <p className={styles.subTitle}>{data?.Contact?.subTitleFirst}</p>

          <p>
            {data?.Contact?.toFAQ}
            <Link href="/faq">{data?.Contact?.toFAQHere}</Link>
            {data?.Contact?.dot}
          </p>
        </div>

        <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={sendFeedback}>
          {({ values, handleChange, errors, touched }) => (
            <Form className={isMode ? styles.form__dark : styles.form}>
              <div className={isMode ? styles.select__dark : styles.select}>
                <Select
                  name="tags"
                  value={values.tags}
                  onChange={handleChange}
                  className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}
                  placeholder={data?.Contact?.chooseTitle}>
                  <option role="option" value={data?.Contact?.suggestion}>
                    {data?.Contact?.suggestion}
                  </option>
                  <option role="option" value={data?.Contact?.problem}>
                    {data?.Contact?.problem}
                  </option>
                </Select>
              </div>

              <FormError nameError="tags" />

              <Input
                name="title"
                value={values.title}
                onChange={handleChange}
                className={!!errors.title && touched.title ? styles.titleInput__error : ''}
                placeholder={data?.Contact?.titleInput}
              />

              <FormError nameError="title" />

              <Textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                className={!!errors.message && touched.message ? styles.message_error : ''}
                placeholder={data?.Contact?.message}
              />

              <FormError nameError="message" />

              <Button
                colorScheme="blue"
                type="submit"
                variant="outline"
                className={styles.button}
                aria-label={data?.Contact?.ariaSend}>
                {data?.AnotherForm?.send}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      {!isUser && <Footer />}
    </div>
  );
}
