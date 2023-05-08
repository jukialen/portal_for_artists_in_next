import { useContext, useState } from 'react';
import { getUserInfo } from 'helpers/getUserInfo';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Progress, Select } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ModeContext } from 'providers/ModeProvider';

import { Tags, EventType, ResetFormType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './FileUpload.module.scss';

type FileDataType = {
  tags: Tags | '';
};

const initialValues: FileDataType = {
  tags: '',
};

export const FilesUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);

  const { isMode } = useContext(ModeContext);
  const data = useHookSWR();

  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
  });

  const handleChangeFile = async (e: EventType) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setRequired(false);
    } else {
      setFile(null);
      setRequired(true);
    }
  };

  const uploadFiles = async ({ tags }: FileDataType, { resetForm }: ResetFormType) => {
    try {
      !file && setRequired(true);
      await axios.post(`${backUrl}/files`, {
        data: { tags },
        file,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValuesFields(`${data?.AnotherForm?.uploadFile}`);
      setFile(null);
      setRequired(false);
      resetForm(initialValues);

      //           setValuesFields('Upload is running');

      //           setValuesFields('Upload is paused');
    } catch (e) {
      console.error(e);
      setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaFile} onSubmit={uploadFiles}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.adding__files}>
          <h3 className={styles.title}>{data?.AnotherForm?.fileTitle}</h3>

          <div className={isMode ? styles.select__dark : styles.select}>
            <Select
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder={data?.chooseTag}
              className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}
              aria-required>
              <option role="option" value="">
                {data?.chooseTag}
              </option>
              <option role="option" value="realistic">
                {data?.Aside?.realistic}
              </option>
              <option role="option" value="manga">
                {data?.Aside?.manga}
              </option>
              <option role="option" value="anime">
                {data?.Aside?.anime}
              </option>
              <option role="option" value="comics">
                {data?.Aside?.comics}
              </option>
              <option role="option" value="photographs">
                {data?.Aside?.photographs}
              </option>
              <option role="option" value="videos">
                {data?.Aside?.videos}
              </option>
              <option role="option" value="animations">
                {data?.Aside?.animations}
              </option>
              <option role="option" value="others">
                {data?.Aside?.others}
              </option>
            </Select>
          </div>

          <FormError nameError="tags" />

          <Input
            name="file"
            type="file"
            accept=".jpg, .jpeg, .png, .webp, .avif, .gif, .mp4, .webm"
            onChange={handleChangeFile}
            placeholder={data?.AnotherForm?.file}
            focusBorderColor="transparent"
            className={!file && required ? styles.input__error : styles.input}
          />

          <p className={styles.error}>{!file && required && data?.NavForm?.validateRequired}</p>

          <button type="submit" className={`button ${styles.button}`} aria-label={data?.AnotherForm?.arialSendingFile}>
            {data?.AnotherForm?.send}
          </button>

          {progressUpload >= 1 && !(valuesFields === `${data?.AnotherForm?.uploadFile}`) && (
            <Progress
              value={progressUpload}
              colorScheme="green"
              isAnimated
              hasStripe
              min={0}
              max={100}
              bg="blue.400"
              size="md"
              className={styles.progressbar}
            />
          )}

          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
