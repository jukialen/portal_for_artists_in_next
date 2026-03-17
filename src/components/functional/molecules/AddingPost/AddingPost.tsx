import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from '../../../../shemasValidation/schemaValidation';

import { createClient } from 'utils/supabase/clientCSR';

import { ResetFormType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { FormError } from 'components/ui/atoms/FormError/FormError';

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

  const supabase = createClient();

  const schemaNew = Yup.object({
    post: SchemaValidation().description,
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
          .insert([{ groupId, userId: authorId, postId: data.postId }])
          .select('id')
          .single();

        if (!!authorError || !authorData) {
          setValueFields(`Post creation error: ${authorError?.message} with code: ${authorError?.code}`);
          return;
        }

        await supabase.from('Posts').update({ roleId: authorData.id }).eq('postId', data.postId);

        resetForm(initialValues);
      } else {
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
              id="post"
              name="post"
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

            {!!valueFields && <Alerts valueFields={valueFields} />}
          </Form>
        )}
      </Formik>
    </>
  );
};
