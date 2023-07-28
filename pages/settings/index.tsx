'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Divider, Icon, Switch, Input, Progress, Textarea } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType, ResetFormType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { ModeContext } from 'providers/ModeProvider';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { DeleteAccount } from 'components/atoms/DeleteAccount/DeleteAccount';
import { FormError } from 'components/molecules/FormError/FormError';
import { AccountData } from 'components/organisms/AccountData/AccountData';

import styles from './index.module.scss';
import { ChevronDownIcon, SunIcon } from '@chakra-ui/icons';
import { MdLanguage } from 'react-icons/md';

type ProfileType = {
  newPseudonym: string;
  newDescription: string;
};

export default function Setings() {
  const { id, description, pseudonym, profilePhoto, provider } = useUserData();
  const { isMode, changeMode } = useContext(ModeContext);
  const [isLanguage, setLanguage] = useState(false);
  const data = useHookSWR();
  const { asPath, locale } = useRouter();

  const [valuesFields, setValuesFields] = useState('');
  const [photo, setPhoto] = useState<File | string | null>(profilePhoto || null);
  const [progressUpload, setProgressUpload] = useState(0);

  const showLanguages = () => setLanguage(!isLanguage);
  
  const initialValues = {
    newPseudonym: pseudonym!,
    newDescription: description!,
    photo: null,
  };

  const schemaNew = Yup.object({
    newPseudonym: SchemaValidation().pseudonym,
    newDescription: SchemaValidation().description,
  });

  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] && setPhoto(e.target.files[0]);
  };

  const updateProfileData = async ({ newPseudonym, newDescription }: ProfileType, { resetForm }: ResetFormType) => {
    try {
      const newUserData = axios.patch(`${backUrl}/users/${pseudonym}`, {
        pseudonym: newPseudonym,
        description: newDescription,
      });

      if (profilePhoto !== null) {
        await axios.patch(`${backUrl}/files/${id}`, {
          data: { file: photo },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await newUserData;

        setValuesFields(`${data?.AnotherForm?.uploadFile}`);

        //     setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
      } else {
        return newUserData;
      }

      resetForm(initialValues);
      setValuesFields(data?.Account?.profile?.successSending);
    } catch (e) {
      console.log(e);
      setValuesFields(data?.Account?.profile?.errorSending);
    }
  };

  return (
    <>
      <HeadCom path={asPath} content="Settings site for unlogged in users" />

      <div className={styles.settings}>
        <h2 className={styles.settings_title}>{data?.Settings?.title}</h2>

        <h3>{data?.Settings?.appearance}</h3>

        <div className={styles.flow}>
          <div className={styles.modeContainer}>
            <div>
              {isMode ? (
                <SunIcon aria-label="mode icon" className={styles.icon} />
              ) : (
                <Icon
                  className={styles.icon}
                  width="21"
                  height="19"
                  viewBox="0 0 21 19"
                  fill="none"
                  color="black.500"
                  aria-label="mode icon">
                  <path
                    d="M20.3018 8.97222C20.3018 14.5104 15.7785 19 10.1987 19C4.61885 19 -0.356859 14.0992 0.0201253 8.97222C0.020125 5.42857 2.35742 1.35714 5.82566 0C0.0955227 10.7063 12.6867 17.0397 20.3018 8.97222Z"
                    fill="black"
                  />
                </Icon>
              )}
              <p>{data?.Settings?.dark_mode}</p>
            </div>
            <Switch
              colorScheme="pink"
              id="switch-mode"
              size="lg"
              className={styles.icon}
              isChecked={!!isMode}
              onChange={changeMode}
            />
          </div>

          <div className={styles.langMenu}>
            <div>
              <MdLanguage className={styles.icon} />
              <p>{data?.Footer?.changeLanguage}</p>
            </div>

            <ul className={styles.languages}>
              <li
                className={`${styles.languages__select} ${!isMode ? styles.langMenu__value : ''}`}
                onClick={showLanguages}>
                <p className={styles.languages__version}>{locale?.toLocaleUpperCase()}</p>
                <ChevronDownIcon />
              </li>

              <div
                className={`${styles.language} ${isLanguage && styles.language__active} ${
                  isMode && styles.language__active__dark
                }`}>
                <li>
                  <Link
                    href={asPath}
                    locale="en"
                    className={`${styles.languages__version} ${isMode && styles.languages__version__dark}`}
                    onClick={() => setLanguage(!isLanguage)}>
                    EN
                  </Link>
                </li>
                <li>
                  <Link
                    href={asPath}
                    locale="jp"
                    className={`${styles.languages__version} ${isMode && styles.languages__version__dark}`}
                    onClick={() => setLanguage(!isLanguage)}>
                    JP
                  </Link>
                </li>
                <li>
                  <Link
                    href={asPath}
                    locale="pl"
                    className={`${styles.languages__version} ${isMode && styles.languages__version__dark}`}
                    onClick={() => setLanguage(!isLanguage)}>
                    PL
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </div>

        {!id && <AccountData data={data} />}

        <h3>{data?.Nav?.profile}</h3>

        <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={updateProfileData}>
          {({ values, handleChange, errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.container}>
                <label htmlFor={data?.AnotherForm?.profilePhoto} className={styles.title}>
                  {data?.AnotherForm?.profilePhoto}
                </label>
                <Input
                  name="photo"
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp, .avif"
                  onChange={handleChangeFile}
                  placeholder={data?.AnotherForm?.profilePhoto}
                  className={(photo === null || undefined) && touched.photo ? styles.input__error : styles.input}
                />
              </div>

              {(photo === null || undefined) && touched.photo && (
                <p className={styles.error_profile}>{data?.NavForm?.validateRequired}</p>
              )}

              <div className={styles.container}>
                <label className={styles.title} htmlFor="newPseudonym">
                  {data?.AnotherForm?.pseudonym}
                </label>
                <Input
                  id="newPseudonym"
                  name="newPseudonym"
                  value={values.newPseudonym}
                  onChange={handleChange}
                  placeholder={data?.AnotherForm?.pseudonym}
                  className={`
                  ${!!errors.newPseudonym && touched.newPseudonym ? styles.input__error : styles.input}
                  ${isMode ? styles.input__dark : ''}
                  `}
                />
              </div>

              {!!errors.newPseudonym && touched.newPseudonym && (
                <div className={styles.error_wrap}>
                  <FormError nameError="newPseudonym" />
                </div>
              )}

              <div className={styles.container}>
                <label className={styles.title} htmlFor="newDescription">
                  {data?.Account?.profile?.aboutMe}
                </label>
                <Textarea
                  id="newDescription"
                  name="newDescription"
                  value={values.newDescription}
                  onChange={handleChange}
                  placeholder={data?.Account?.profile?.aboutMe}
                  className={`
                    ${
                      !!errors.newDescription && touched.newDescription ? styles.description__error : styles.description
                    }
                    ${isMode ? styles.description__dark : ''}
                  `}
                />
              </div>
              {!!errors.newDescription && touched.newDescription && (
                <div className={styles.error_wrap}>
                  <FormError nameError="newDescription" />
                </div>
              )}

              <button
                className={`${styles.button} button`}
                type="submit"
                aria-label={data?.Account?.profile?.ariaLabelButton}>
                {data?.Account?.profile?.save}
              </button>

              {progressUpload >= 1 && !(valuesFields === `${data?.AnotherForm?.uploadFile}`) && (
                <Progress
                  value={progressUpload}
                  colorScheme="green"
                  isAnimated
                  hasStripe
                  min={0}
                  max={100}
                  w={280}
                  bg="blue.400"
                  m="1.5rem auto"
                  size="md"
                />
              )}

              {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
            </Form>
          )}
        </Formik>

        <footer>
          <button className={styles.links}>
            <Link href="/terms">{data?.Footer?.termsOfUse}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/privacy">{data?.Footer?.privacyPolice}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/contact">{data?.Footer?.contact}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/faq">{data?.Footer?.faq}</Link>
          </button>
          <button className={styles.links}>
            <Link href="/plans">{data?.Footer?.plans}</Link>
          </button>
        </footer>

        {!!id && (
          <>
            <Divider />
            <DeleteAccount pseudonym={pseudonym!} />
          </>
        )}
      </div>
    </>
  );
}
