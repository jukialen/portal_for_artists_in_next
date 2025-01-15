import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button, Textarea } from '@chakra-ui/react';
import { Avatar } from "components/ui/avatar";

import { backUrl } from 'constants/links';

import { useScopedI18n } from 'locales/client';

import { ResetFormType, NewCommentsType } from 'types/global.types';

import styles from './NewComments.module.scss';

type NewCommentType = { comment: string };

export const NewComments = ({
  fileId,
  groupId,
  authorId,
  postId,
  commentId,
  subCommentId,
  fileCommentId,
  adModRoleId,
  profilePhoto
}: NewCommentsType) => {
  const initialValues = { comment: '' };

  const tComments = useScopedI18n('Comments');

  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const updateCommentId = async (roleId: string, commentId: string) =>
    await fetch(`${backUrl}/api/roles`, {
      method: 'PATCH',
      body: JSON.stringify({ roleId, commentId }),
    }).then((r) => r.json());

  const createNewComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      const { id: roleId }: { id: string } = await fetch(`${backUrl}/api/roles`, {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          postId,
          groupId,
          userId: authorId,
        }),
      }).then((t) => t.json());

      if (!!subCommentId) {
        const { roleId: subRoleId, lastCommentId }: { roleId: string; lastCommentId: string } = await fetch(
          `${backUrl}/api/last-comments`,
          {
            method: 'POST',
            body: JSON.stringify({
              lastComment: comment,
              subCommentId,
              adModRoleId,
              roleId,
              authorId,
            }),
          },
        ).then((s) => s.json());
        await updateCommentId(subRoleId, lastCommentId);
      }
      if (!!(commentId || fileCommentId)) {
        const { roleId: comFileComId, subCommentId: subComId }: { roleId: string; subCommentId: string } = await fetch(
          `${backUrl}/api/sub-comments`,
          {
            method: 'POST',
            body: JSON.stringify({
              subComment: comment,
              commentId,
              fileCommentId,
              fileId,
              postId,
              adModRoleId,
              roleId,
              authorId,
            }),
          },
        ).then((cf) => cf.json());
        await updateCommentId(comFileComId, subComId!);
      }
      if (!!fileId) {
        const { roleId: fileRoleId, fileCommentId: fileComId }: { roleId: string; fileCommentId: string } = await fetch(
          `${backUrl}/api/files-comments`,
          {
            method: 'POST',
            body: JSON.stringify({
              authorId,
              comment,
              fileId,
              roleId,
            }),
          },
        ).then((f) => f.json());
        await updateCommentId(fileRoleId, fileComId);
      } else {
        const { roleId: comRoleId, fileCommentId: comId }: { roleId: string; fileCommentId: string } = await fetch(
          `${backUrl}/api/comments`,
          {
            method: 'POST',
            body: JSON.stringify({ authorId, comment, roleId, postId, adModRoleId }),
          },
        ).then((c) => c.json());

        await updateCommentId(comRoleId, comId);
      }

      resetForm(initialValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={createNewComment}>
      {({ values, handleChange }) => (
        <Form>
          <div className={styles.comments}>
            <Avatar src={profilePhoto} width={10} height={10} marginTop=".4rem" />

            <Textarea
              name="comment"
              id="comment"
              value={values.comment}
              onChange={handleChange}
              placeholder={tComments('newComPlaceholder')}
              aria-label={tComments('newComAria')}
              required
              className={styles.text}
            />
          </div>

          <Button type="submit" colorScheme="blue" display="flex" className={styles.addingButton}>
            {tComments('newComButton')}
          </Button>

          <ErrorMessage name="comment" />
        </Form>
      )}
    </Formik>
  );
};
