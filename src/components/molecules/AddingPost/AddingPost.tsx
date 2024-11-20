import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Textarea } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ResetFormType } from 'types/global.types';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './AddingPost.module.scss';

type AddingPostType = {
  groupId: string;
  translatedPost: {
    add: string;
    addTitPlaceholder: string;
    addTitAria: string;
    addDescription: string;
    addDesAria: string;
  };
  errorTr: string;
  authorId: string;
  roleId: string;
};

type NewPostType = { title: string; content: string };

export const AddingPost = ({ groupId, authorId, roleId, translatedPost, errorTr }: AddingPostType) => {
  const [showForm, setShowForm] = useState(false);
  const [valueFields, setValueFields] = useState('');

  const initialValues = { title: '', content: '' };

  const supabase = createClientComponentClient();

  const schemaNew = Yup.object({
    post: SchemaValidation().description,
    title: SchemaValidation().description,
  });

  const createNewPost = async ({ title, content }: NewPostType, { resetForm }: ResetFormType) => {
    const { data, error } = await supabase
      .from('Posts')
      .insert([{ title, content, groupId, authorId, roleId }])
      .select('title')
      .limit(1)
      .single();
    try {
      if (!!data) {
        resetForm(initialValues);
      } else {
        console.error(`Post creation error: ${error?.message} with code: ${error?.code}`);
        setValueFields(`Post creation error: ${error?.message} with code: ${error?.code}`);
      }
    } catch (e) {
      console.error(e);
      setValueFields(errorTr);
    }
  };

  return (
    <>
      <button className={styles.showForm} onClick={() => setShowForm(!showForm)}>
        {translatedPost.add}
      </button>

      <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={createNewPost}>
        {({ values, handleChange, errors, touched }) => (
          <Form className={showForm ? styles.form : styles.hiding}>
            <Input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder={translatedPost.addTitPlaceholder}
              aria-label={translatedPost.addTitAria}
              className={touched.title && !!errors.title ? styles.title__error : styles.title}
            />

            <FormError nameError="title" />

            <Textarea
              id="post"
              name="post"
              value={values.content}
              onChange={handleChange}
              resize="vertical"
              placeholder={translatedPost.addDescription}
              aria-label={translatedPost.addDesAria}
              className={!!errors.content && touched.content ? styles.description__error : styles.description}
            />

            <FormError nameError="content" />

            <Button type="submit" colorScheme="blue.800" className={styles.addingButton}>
              {translatedPost.add}
            </Button>

            {!!valueFields && <Alerts valueFields={valueFields} />}
          </Form>
        )}
      </Formik>
    </>
  );
};
