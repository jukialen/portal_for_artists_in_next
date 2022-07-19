import { useState } from 'react';
import { auth } from '../../../firebase';
import { updateDoc } from 'firebase/firestore';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, Textarea, IconButton } from '@chakra-ui/react';

import { FormType} from 'types/global.types';

import { usersInGroup } from 'references/referencesFirebase';

import { useHookSWR } from 'hooks/useHookSWR';

import { SchemaValidation } from 'shemasValidation/schemaValidation';

import styles from './DescriptionSection.module.scss';
import { EditIcon } from '@chakra-ui/icons';

type DescriptionSectionType = {
  description: string;
  admin: string;
  name?: string | string[];
}
type NewDescType = {
  newDescription: string;
};

export const DescriptionSection = ({ description, admin, name }: DescriptionSectionType) => {
  const data = useHookSWR();
  const [openForm, setOpenForm] = useState(false);
  
  const currentUser = auth.currentUser?.uid;
  
  const initialValues = {
    newDescription: description
  };
  
  const schemaNew = Yup.object({
    newDescription: SchemaValidation().description,
  });
  
  const updateDescription = async ({ newDescription }: NewDescType, { resetForm }: FormType) => {
    try {
      await updateDoc(usersInGroup(name!), { description: newDescription });
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
    }
  };
  
  return <section className={styles.container__description}>
    <h2 className={styles.description__title}>{data?.AnotherForm?.description}</h2>
    <Divider />
    <div className={styles.desField}>
      {!openForm ? <p className={styles.description}>{description}</p> : <Formik
        initialValues={initialValues}
        validationSchema={schemaNew}
        onSubmit={updateDescription}
      >
        {({ values, handleChange }) => (
          <Form className={styles.form}>
            <Textarea
              id='newDescription'
              name='newDescription'
              value={values.newDescription}
              onChange={handleChange}
              resize='vertical'
              placeholder={data?.Description?.textPlaceholder}
              aria-label={data?.Description?.textAria}
              className={styles.formDescription}
            />
      
            <p><ErrorMessage name='newDescription' /></p>
            
            <Button
              type='submit'
              colorScheme='blue'
              className={styles.addingButton}
            >
              {data?.Description?.submit}
            </Button>
          </Form>
        )}
      </Formik>}
      {admin === currentUser &&
        <IconButton
          aria-label={data?.Description?.iconButton}
          onClick={() => setOpenForm(!openForm)}
          icon={<EditIcon fontSize='1.2rem' />} />
      }
    </div>
   
    <h2 className={styles.description}>{data?.Regulations}</h2>
    <Divider />
    <p className={styles.regulations__item}>
      1) Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
    <p className={styles.regulations__item}>
      2) Pellentesque scelerisque tortor nec ex mattis, non consectetur sapien imperdiet. Cras sed sem
      volutpat arcu gravida mattis non commodo ligula. Curabitur sed magna in nisi rutrum iaculis. Morbi sed
      nulla et odio finibus viverra a ac leo. Quisque a enim pharetra, cursus est ut, ullamcorper nibh.
    </p>
    <p className={styles.regulations__item}>
      3) Nam auctor sem eu ipsum consequat rutrum. Phasellus vel nulla sodales, finibus felis nec, ullamcorper
      metus.
    </p>
    <p className={styles.regulations__item}>
      4) Donec ac magna ac risus egestas semper eget vel purus. Curabitur luctus sem sed maximus tincidunt.
      Nullam efficitur leo quis pretium efficitur. Ut id ex eu odio tristique elementum.
    </p>
    <p className={styles.regulations__item}>
      5) Aliquam non nisi ac nulla commodo porta. Morbi id metus eget arcu dictum sodales eu at sapien.
    </p>
    <p className={styles.regulations__item}>
      6) Praesent quis justo non dolor tincidunt convallis pellentesque sit amet libero. Sed sit amet tortor
      tempus, viverra ex et, vestibulum justo. Pellentesque quis leo sed purus accumsan commodo. Duis varius
      lorem at justo rhoncus finibus. Phasellus in tellus a lacus accumsan blandit condimentum sed dolor.
    </p>
    <p className={styles.regulations__item}>
      7) Etiam id nulla a mi molestie ultrices et et neque. Quisque id ligula nec felis facilisis imperdiet.
    </p>
    <p className={styles.regulations__item}>
      8) Curabitur mattis dolor at pellentesque lobortis. Morbi vestibulum ante tincidunt, commodo metus non,
      placerat tortor. Duis mattis urna ut felis ultrices rhoncus.
    </p>
    <p className={styles.regulations__item}>
      9) Integer vel orci rutrum, malesuada risus non, lobortis est. Duis eleifend dui in quam commodo egestas.
    </p>
    <p className={styles.regulations__item}>
      10) Praesent vehicula nisl id mauris lobortis imperdiet. In facilisis neque a libero molestie, sed
      lacinia urna aliquam. Aenean sed dolor porta, venenatis dolor et, sollicitudin ante. Etiam at nisl eget
      libero lobortis faucibus.
    </p>
  </section>
  
}