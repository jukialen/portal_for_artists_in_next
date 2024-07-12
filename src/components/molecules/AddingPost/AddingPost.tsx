import { useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Textarea } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ResetFormType } from 'types/global.types';

import { backUrl } from 'constants/links';

import { FormError } from 'components/atoms/FormError/FormError';

import styles from './AddingPost.module.scss';

type AddingPostType = { groupId: string };

type NewPostType = { title: string; content: string };

export const AddingPost = ({ groupId }: AddingPostType) => {
  const [showForm, setShowForm] = useState(false);

  const initialValues = { title: '', content: '' };

  const schemaNew = Yup.object({
    post: SchemaValidation().description,
    title: SchemaValidation().description,
  });

  const createNewPost = async ({ title, content }: NewPostType, { resetForm }: ResetFormType) => {
    try {
      await axios.post(`${backUrl}/posts`, {
        title,
        content,
        groupId,
      });
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button className={styles.showForm} onClick={() => setShowForm(!showForm)}>
        {language?.Groups?.addingPost?.add}
      </button>

      <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={createNewPost}>
        {({ values, handleChange, errors, touched }) => (
          <Form className={showForm ? styles.form : styles.hiding}>
            <Input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder={language?.Groups?.addingPost?.addTitPlaceholder}
              aria-label={language?.Groups?.addingPost?.addTitAria}
              className={touched.title && !!errors.title ? styles.title__error : styles.title}
            />

            <FormError nameError="title" />

            <Textarea
              id="post"
              name="post"
              value={values.content}
              onChange={handleChange}
              resize="vertical"
              placeholder={language?.Groups?.addingPost?.addDescription}
              aria-label={language?.Groups?.addingPost?.addDesAria}
              className={!!errors.content && touched.content ? styles.description__error : styles.description}
            />

            <FormError nameError="content" />

            <Button type="submit" colorScheme="blue.800" className={styles.addingButton}>
              {language?.Groups?.addingPost?.add}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
