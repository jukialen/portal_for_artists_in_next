import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button, Divider, IconButton, Textarea } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { ResetFormType } from 'types/global.types';

import { useI18n, useScopedI18n } from 'locales/client';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './DescriptionSection.module.scss';
import { EditIcon } from '@chakra-ui/icons';

type DescriptionSectionType = {
  description: string;
  regulation: string;
  admin: boolean;
  groupId: string;
};

type NewDescType = {
  newDescription: string;
};

type NewRegulationType = {
  newRegulation: string;
};

export const DescriptionSection = ({ description, regulation, admin, groupId }: DescriptionSectionType) => {
  const tRegulation = useScopedI18n('Regulations');
  const tDescription = useScopedI18n('Description');
  const t = useI18n();

  const [regul, setRegul] = useState(regulation);
  const [descrip, setDescrip] = useState(description);
  const [openDescriptionForm, setOpenDescriptionForm] = useState(false);
  const [openUpRegulation, setOpenUpRegulation] = useState(false);
  const [valuesFields, setValuesFields] = useState('');

  const supabase = createClientComponentClient();

  const initialValuesDes = { newDescription: descrip };
  const initialValuesReg = { newRegulation: regul };

  const schemaNewDes = Yup.object({
    newDescription: SchemaValidation().description,
  });

  const schemaNewReg = Yup.object({
    newRegulation: SchemaValidation().description,
  });

  const updateDescription = async ({ newDescription }: NewDescType, { resetForm }: ResetFormType) => {
    const { status, statusText, data, error } = await supabase
      .from('Groups')
      .update([{ description: newDescription }])
      .eq('groupId', groupId)
      .select('description')
      .limit(1)
      .single();
    if (status === 200 || 204) {
      resetForm(initialValuesReg);
      setDescrip(data?.description);
    } else {
      console.error(`statusText: ${statusText} \n Error: ${error}`);
      setValuesFields(`${t('unknownError')}. \n Error: ${error}`);
    }
  };

  const updateRegulations = async ({ newRegulation }: NewRegulationType, { resetForm }: ResetFormType) => {
    const { status, statusText, data, error } = await supabase
      .from('Groups')
      .update([{ regulation: newRegulation }])
      .eq('groupId', groupId)
      .select('regulation')
      .limit(1)
      .single();

    if (status === 200 || 204) {
      resetForm(initialValuesReg);
      setRegul(data?.regulation);
    } else {
      console.error(`statusText: ${statusText} \n Error: ${error}`);
      setValuesFields(`${t('unknownError')}. \n Error: ${error}`);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{t('AnotherForm.description')}</h2>

      <Divider />
      <div className={styles.field}>
        {!openDescriptionForm ? (
          <p className={styles.items}>{descrip}</p>
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
                  placeholder={tDescription('textPlaceholder')}
                  aria-label={tDescription('textAria')}
                  className={
                    !!errors.newDescription && touched.newDescription ? styles.updateField__error : styles.updateField
                  }
                />

                <FormError nameError="newDescription" />

                <Button type="submit" colorScheme="blue" className={styles.addingButton}>
                  {tDescription('submit')}
                </Button>

                {!!valuesFields && <Alerts valueFields={valuesFields} />}
              </Form>
            )}
          </Formik>
        )}
        {admin && (
          <IconButton
            icon={<EditIcon />}
            className={styles.changeButton}
            aria-label={tDescription('iconButton')}
            onClick={() => setOpenDescriptionForm(!openDescriptionForm)}
          />
        )}
      </div>

      <h2 className={styles.title}>{tRegulation('regulation')}</h2>
      <Divider />
      <div className={styles.field}>
        {!openUpRegulation ? (
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
                  placeholder={tDescription('textPlaceholder')}
                  aria-label={tDescription('textAria')}
                  className={
                    !!errors.newRegulation && touched.newRegulation ? styles.updateField__error : styles.updateField
                  }
                />

                <FormError nameError="newRegulation" />

                <Button type="submit" colorScheme="blue" className={styles.addingButton}>
                  {tDescription('submit')}
                </Button>

                {!!valuesFields && <Alerts valueFields={valuesFields} />}
              </Form>
            )}
          </Formik>
        )}
        {admin && (
          <IconButton
            icon={<EditIcon />}
            className={styles.changeButton}
            aria-label={tDescription('iconButton')}
            onClick={() => setOpenUpRegulation(!openUpRegulation)}
          />
        )}
      </div>
    </section>
  );
};
