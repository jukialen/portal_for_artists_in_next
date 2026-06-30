'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from '../../../../schemasValidation/schemaValidation';

import { createClient } from 'utils/supabase/clientCSR';

import { ResetFormType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { FormError } from 'components/ui/atoms/FormError/FormError';

import styles from './AddingPost.module.css';

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

  const supabase = createClient();

  const schemaNew = Yup.object({
    content: SchemaValidation().description,
    title: SchemaValidation().description,
  });

  const createNewPost = async ({ title, content }: NewPostType, { resetForm }: ResetFormType) => {
    try {
      const { data, error } = await supabase
        .from('Posts')
        .insert([{ title, content, groupId, authorId, roleId }])
        .select('title, postId')
        .single();

      if (!!data) {
        const { data: authorData, error: authorError } = await supabase
          .from('Roles')
          .insert([{ groupId, userId: authorId, postId: data.postId, role: 'AUTHOR' }])
          .select('id')
          .single();

        if (!!authorError || !authorData) {
          setValueFields(`Post creation error: ${authorError?.message} with code: ${authorError?.code}`);
          return;
        }

        const { data: postData, error: postError } = await supabase
          .from('Posts')
          .update({ roleId: authorData.id })
          .eq('postId', data.postId);

        if (!postData || postError) {
          setValueFields(postError?.message!);
          throw postError;
        }

        resetForm(initialValues);
        setShowForm(!showForm);
      } else {
        setValueFields(`Post creation error: ${error?.message} with code: ${error?.code}`);
      }
    } catch (e) {
      console.error(e);
      setValueFields(errorTr);
    }
  };

  return (
    <section className={styles.newPostContainer}>
      <button className={styles.showForm} onClick={() => setShowForm(!showForm)}>
        {translatedPost.add}
      </button>

      <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={createNewPost}>
        {({ values, handleChange, errors, touched }) => (
          <Form className={showForm ? styles.form : styles.hiding}>
            <input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder={translatedPost.addTitPlaceholder}
              aria-label={translatedPost.addTitAria}
              className={touched.title && !!errors.title ? styles.title__error : styles.title}
            />

            <FormError nameError="title" />

            <textarea
              id="content"
              name="content"
              value={values.content}
              onChange={handleChange}
              placeholder={translatedPost.addDescription}
              aria-label={translatedPost.addDesAria}
              className={!!errors.content && touched.content ? styles.description__error : styles.description}
            />

            <FormError nameError="content" />

            <button type="submit" className={styles.addingButton}>
              {translatedPost.add}
            </button>

            <div className={styles.alert}>{!!valueFields && <Alerts valueFields={valueFields} />}</div>
          </Form>
        )}
      </Formik>
    </section>
  );
};
