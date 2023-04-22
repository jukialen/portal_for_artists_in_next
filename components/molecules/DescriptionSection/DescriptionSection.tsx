import { useEffect, useState } from 'react';
import { auth } from '../../../firebase';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, IconButton, Textarea } from '@chakra-ui/react';

import { ResetFormType } from 'types/global.types';

import { groups } from 'config/referencesFirebase';

import { useHookSWR } from 'hooks/useHookSWR';

import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './DescriptionSection.module.scss';
import { EditIcon } from '@chakra-ui/icons';

type DescriptionSectionType = {
  description: string;
  admin: string;
  name?: string | string[];
};
type NewDescType = {
  newDescription: string;
};

type NewRegulationType = {
  newRegulation: string;
};

export const DescriptionSection = ({ description, admin, name }: DescriptionSectionType) => {
  const [regulation, setRegulation] = useState<NewRegulationType[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openUpRegulations, setOpenUpRegulations] = useState(false);

  const data = useHookSWR();
  const currentUser = auth.currentUser?.uid;

  const initialValuesDes = { newDescription: description };

  const schemaNewDes = Yup.object({
    newDescription: SchemaValidation().description,
  });

  const getRegulation = async () => {
    try {
      const docSnap = await getDoc(groups(name!));

      docSnap.exists() ? setRegulation(docSnap.data().regulation) : console.log('No regulation!');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!name && getRegulation();
  }, [name]);

  const updateDescription = async ({ newDescription }: NewDescType, { resetForm }: ResetFormType) => {
    try {
      await updateDoc(groups(name!), { description: newDescription });
      resetForm(initialValuesDes);
    } catch (e) {
      console.error(e);
    }
  };

  const initialValuesReg = {
    newRegulation:
      !!regulation && regulation.length > 0
        ? regulation.join('\n')
        : data?.Regulations?.noRegulation,
  };

  const schemaNewReg = Yup.object({
    newRegulation: SchemaValidation().description,
  });

  const updateRegulations = async (
    { newRegulation }: NewRegulationType,
    { resetForm }: ResetFormType,
  ) => {
    try {
      const newRerArray = newRegulation.split(/\r?\n/).filter((el) => el);
      await setDoc(groups(name!), { regulation: newRerArray }, { merge: true });
      resetForm(initialValuesReg);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{data?.AnotherForm?.description}</h2>

      <Divider />
      <div className={styles.field}>
        {!openForm ? (
          <p className={styles.items}>{description}</p>
        ) : (
          <Formik
            initialValues={initialValuesDes}
            validationSchema={schemaNewDes}
            onSubmit={updateDescription}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.form}>
                <Textarea
                  id="newDescription"
                  name="newDescription"
                  value={values.newDescription}
                  onChange={handleChange}
                  resize="vertical"
                  placeholder={data?.Description?.textPlaceholder}
                  aria-label={data?.Description?.textAria}
                  className={
                    !!errors.newDescription && touched.newDescription
                      ? styles.updateField__error
                      : styles.updateField
                  }
                />

                <FormError nameError="newDescription" />

                <Button type="submit" colorScheme="blue" className={styles.addingButton}>
                  {data?.Description?.submit}
                </Button>
              </Form>
            )}
          </Formik>
        )}
        {admin === currentUser && (
          <IconButton
            icon={<EditIcon />}
            className={styles.changeButton}
            aria-label={data?.Description?.iconButton}
            onClick={() => setOpenForm(!openForm)}
          />
        )}
      </div>

      <h2 className={styles.title}>{data?.Regulations?.regulation}</h2>
      <Divider />
      <div className={styles.field}>
        {!openUpRegulations ? (
          <div className={styles.items}>
            {!!regulation && regulation.length > 0 ? (
              regulation.map((reg, index) => (
                <p key={index} className={styles.regulations__item}>
                  {reg}
                </p>
              ))
            ) : (
              <p className={styles.regulations__no__item}>{data?.Regulations?.noRegulation}</p>
            )}
          </div>
        ) : (
          <Formik
            initialValues={initialValuesReg}
            validationSchema={schemaNewReg}
            onSubmit={updateRegulations}>
            {({ values, handleChange, errors, touched }) => (
              <Form className={styles.form}>
                <Textarea
                  id="newRegulation"
                  name="newRegulation"
                  value={values.newRegulation}
                  onChange={handleChange}
                  resize="vertical"
                  placeholder={data?.Description?.textPlaceholder}
                  aria-label={data?.Description?.textAria}
                  className={
                    !!errors.newRegulation && touched.newRegulation
                      ? styles.updateField__error
                      : styles.updateField
                  }
                />

                <FormError nameError="newRegulation" />

                <Button type="submit" colorScheme="blue" className={styles.addingButton}>
                  {data?.Description?.submit}
                </Button>
              </Form>
            )}
          </Formik>
        )}
        {admin === currentUser && (
          <IconButton
            icon={<EditIcon />}
            className={styles.changeButton}
            aria-label={data?.Description?.iconButton}
            onClick={() => setOpenUpRegulations(!openUpRegulations)}
          />
        )}
      </div>
    </section>
  );
};
