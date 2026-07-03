'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';

import { useI18n, useScopedI18n } from 'locales/client';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './DeletionPost.module.css';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxChevronUp, RxChevronDown } from 'react-icons/rx';

type DeletionPostType = {
  groupId: string;
  postId: string;
  roleId: string;
  userId: string;
};

export const DeletePost = ({ groupId, postId, roleId, userId }: DeletionPostType) => {
  const [values, setValues] = useState('');
  const [del, setDel] = useState(false);

  const t = useI18n();
  const tDeletionFile = useScopedI18n('DeletionFile');
  const tDeletionPost = useScopedI18n('DeletionPost');

  const deletePost = async () => {
    const supabase = createClient();

    try {
      setValues(tDeletionPost('deleting'));
      const { error } = await supabase
        .from('Roles')
        .delete()
        .eq('postId', postId)
        .eq('groupId', groupId)
        .eq('userId', userId);

      if (!!error) {
        setValues(t('error'));
        return;
      }

      const { error: postError } = await supabase
        .from('Posts')
        .delete()
        .eq('postId', postId)
        .eq('groupId', groupId)
        .eq('authorId', userId);

      if (!!postError) {
        setValues(t('error'));
        const { error } = await supabase
          .from('Roles')
          .insert([{ postId, groupId, userId, role: 'AUTHOR' }])
          .eq('id', roleId);
        return;
      }

      setValues(tDeletionPost('deleted'));
    } catch (e) {
      console.error(e);
      setValues(t('error'));
    }
  };

  return (
    <>
      <button onClick={() => setDel(!del)} className={styles.icon} aria-label="menu button for a post">
        {del ? <RxChevronUp /> : <RxChevronDown />}
      </button>

      <button
        className={del ? styles.container__active : styles.container}
        popoverTarget={`deletion-post-${postId}`}
        popoverTargetAction="toggle">
        <RiDeleteBinLine />
        {tDeletionFile('deletionButton')}
      </button>
      <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
      <div id={`deletion-post-${postId}`} className={styles.content} popover="auto">
        <h4 className={styles.title}>{tDeletionPost('title')}</h4>

        <p>{tDeletionFile('question')}</p>

        <div className={styles.actionButton}>
          <button
            className={styles.cancel}
            onClick={() => setDel(!del)}
            popoverTarget={`deletion-post-${postId}`}
            popoverTargetAction="hide">
            {tDeletionFile('cancelButton')}
          </button>
          <button
            className={styles.submit}
            onClick={deletePost}
            popoverTarget={`deletion-post-${postId}`}
            popoverTargetAction="hide">
            {tDeletionFile('deleteButton')}
          </button>
        </div>
      </div>
    </>
  );
};
