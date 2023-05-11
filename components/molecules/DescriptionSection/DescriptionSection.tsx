import { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, IconButton, Textarea } from '@chakra-ui/react';

import { ResetFormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './DescriptionSection.module.scss';
import { EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { backUrl } from 'utilites/constants';

type DescriptionSectionType = {
  description: string;
  admin: boolean;
  name?: string | string[];
  usersGroupsId: string;
};

type NewDescType = {
  newDescription: string;
};

type NewRegulationType = {
  newRegulation: string;
};

export const DescriptionSection = ({ description, admin, name, usersGroupsId }: DescriptionSectionType) => {
  const [regulation, setRegulation] = useState<string>('');
  const [openForm, setOpenForm] = useState(false);
  const [openUpRegulations, setOpenUpRegulations] = useState(false);

  const data = useHookSWR();

  const initialValuesDes = { newDescription: description };

  const schemaNewDes = Yup.object({
    newDescription: SchemaValidation().description,
  });

  const getRegulation = async () => {
    try {
      const reg: { regulation: string } = await axios.get(`${backUrl}/groups/${name}`);
      setRegulation(!!reg.regulation ? reg.regulation.split('\n').join('\n') : data?.Regulations?.noRegulation);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!name && getRegulation();
  }, [name]);

  const updateDescription = async ({ newDescription }: NewDescType, { resetForm }: ResetFormType) => {
    try {
      await axios.patch(`${backUrl}/groups/${name}`, {
        data: { description: newDescription, usersGroupsId },
      });
      resetForm(initialValuesDes);
    } catch (e) {
      console.error(e);
    }
  };

  const initialValuesReg = {
    newRegulation: regulation
  };

  const schemaNewReg = Yup.object({
    newRegulation: SchemaValidation().description,
  });

  const updateRegulations = async ({ newRegulation }: NewRegulationType, { resetForm }: ResetFormType) => {
    try {
      await axios.patch(`${backUrl}/groups/${name}`, {
        data: { regulation: newRegulation, usersGroupsId },
      });
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
          <Formik initialValues={initialValuesDes} validationSchema={schemaNewDes} onSubmit={updateDescription}>
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
                    !!errors.newDescription && touched.newDescription ? styles.updateField__error : styles.updateField
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
        {admin && (
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
            <p className={!!regulation ? styles.regulations__item : styles.regulations__no__item}>{regulation}</p>
          </div>
        ) : (
          <Formik initialValues={initialValuesReg} validationSchema={schemaNewReg} onSubmit={updateRegulations}>
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
                    !!errors.newRegulation && touched.newRegulation ? styles.updateField__error : styles.updateField
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
        {admin && (
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
