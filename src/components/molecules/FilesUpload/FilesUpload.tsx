'use client'

import { useContext, useState } from 'react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  useDisclosure,
  Button,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ModeContext } from 'providers/ModeProvider';

import { Tags, EventType, ResetFormType } from 'types/global.types';

import { backUrl, darkMode } from 'constants/links';

import { FormError } from 'components/molecules/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './FileUpload.module.scss';
import { MdUploadFile } from 'react-icons/md';

type FileDataType = {
  shortDescription: string;
  tags: Tags | '';
};

const initialValues: FileDataType = {
  shortDescription: '',
  tags: '',
};

export const FilesUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [required, setRequired] = useState(false);

  const { isMode } = useContext(ModeContext);


  const { isOpen, onOpen, onClose } = useDisclosure();

  const schemaFile = Yup.object({
    tags: SchemaValidation().tags,
    shortDescription: SchemaValidation().shortDescription,
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

  const uploadFiles = async ({ tags, shortDescription }: FileDataType, { resetForm }: ResetFormType) => {
    try {
      !file && setRequired(true);
      await axios.post(`${backUrl}/files`, {
        data: { tags, shortDescription },
        file,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValuesFields(`${language?.AnotherForm?.uploadFile}`);
      setFile(null);
      setRequired(false);
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
      setValuesFields(`${language?.AnotherForm?.notUploadFile}`);
    }
  };

  return (
    <>
      <Button
        aria-label="new logo"
        rightIcon={<MdUploadFile size="1.4rem" />}
        colorScheme="blue"
        className={styles.updateLogo}
        onClick={onOpen}>
        New file
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className={`${isMode === darkMode ? styles.darkModalContent : ''} ${styles.modelContent}`}>
          <ModalHeader>New logo</ModalHeader>
          <ModalCloseButton className={styles.closeButton} />
          <ModalBody className={styles.modal}>
            <Formik initialValues={initialValues} validationSchema={schemaFile} onSubmit={uploadFiles}>
              {({ values, handleChange, errors, touched }) => (
                <Form className={styles.adding__files}>
                  <h3 className={styles.title}>{language?.AnotherForm?.fileTitle}</h3>

                  <div className={isMode === darkMode ? styles.select__dark : styles.select}>
                    <Select
                      name="tags"
                      value={values.tags}
                      onChange={handleChange}
                      className={!!errors.tags && touched.tags ? styles.tags__error : styles.tags}
                      backgroundColor="#red"
                      aria-required>
                      <option role="option" value="">
                        {language?.chooseTag}
                      </option>
                      <option role="option" value="realistic">
                        {language?.Aside?.realistic}
                      </option>
                      <option role="option" value="manga">
                        {language?.Aside?.manga}
                      </option>
                      <option role="option" value="anime">
                        {language?.Aside?.anime}
                      </option>
                      <option role="option" value="comics">
                        {language?.Aside?.comics}
                      </option>
                      <option role="option" value="photographs">
                        {language?.Aside?.photographs}
                      </option>
                      <option role="option" value="videos">
                        {language?.Aside?.videos}
                      </option>
                      <option role="option" value="animations">
                        {language?.Aside?.animations}
                      </option>
                      <option role="option" value="others">
                        {language?.Aside?.others}
                      </option>
                    </Select>
                  </div>

                  <FormError nameError="tags" />

                  <Input
                    name="file"
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp, .avif, .gif, .mp4, .webm"
                    onChange={handleChangeFile}
                    placeholder={language?.AnotherForm?.file}
                    focusBorderColor="transparent"
                    className={!file && required ? styles.input__error : styles.input}
                  />

                  <p className={styles.error}>{!file && required && language?.NavForm?.validateRequired}</p>

                  <Textarea
                    name="shortDescription"
                    value={values.shortDescription}
                    onChange={handleChange}
                    placeholder="short description for file"
                    className={`
                    ${
                      !!errors.shortDescription && touched.shortDescription
                        ? styles.shortDescription__error
                        : styles.shortDescription
                    }
                    ${isMode === darkMode ? styles.shortDescription__dark : ''}
                    `}
                  />

                  {!!errors.shortDescription && touched.shortDescription && (
                    <div className={styles.error_wrap}>
                      <FormError nameError="shortDescription" />
                    </div>
                  )}

                  {progressUpload >= 1 && !(valuesFields === `${language?.AnotherForm?.uploadFile}`) && (
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

                  <div className={styles.buttons}>
                    <Button type="submit" colorScheme="blue" borderColor="transparent" mr={3} onClick={onClose}>
                      {language?.DeletionFile?.cancelButton}
                    </Button>
                    <Button type="submit" colorScheme="yellow" borderColor="transparent">
                      {language?.Description?.submit}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
