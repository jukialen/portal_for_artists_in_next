import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, IconButton, Textarea } from '@chakra-ui/react';

import { ResetFormType } from 'src/types/global.types';

<<<<<<< Updated upstream:components/molecules/DescriptionSection/DescriptionSection.tsx
import { backUrl } from 'utilites/constants';
=======
import { backUrl } from 'src/constants/links';

>>>>>>> Stashed changes:source/components/molecules/DescriptionSection/DescriptionSection.tsx

import { useHookSWR } from 'hooks/useHookSWR';

import { SchemaValidation } from 'src/shemasValidation/schemaValidation';
import { FormError } from 'src/components/molecules/FormError/FormError';

import styles from './DescriptionSection.module.scss';
import { EditIcon } from '@chakra-ui/icons';

type DescriptionSectionType = {
  description: string;
  regulation: string;
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

export const DescriptionSection = ({ description, regulation, admin, name, usersGroupsId }: DescriptionSectionType) => {
  const [regul, setRegul] = useState(regulation);
  const [openForm, setOpenForm] = useState(false);
  const [openUpRegulations, setOpenUpRegulations] = useState(false);

  const data = useHookSWR();

  const initialValuesDes = { newDescription: description };

  const schemaNewDes = Yup.object({
    newDescription: SchemaValidation().description,
  });

  const getRegulation = async () => {
    setRegul(regulation === '' ? regulation.split('\n').join('\n') : data?.Regulations?.noRegulation);
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
    newRegulation: regul,
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
            <p className={!!regul ? styles.regulations__item : styles.regulations__no__item}>{regul}</p>
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
