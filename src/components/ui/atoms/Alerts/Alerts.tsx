import { useI18n } from 'locales/client';

import styles from './Alerts.module.scss';
import { RiErrorWarningLine } from 'react-icons/ri';
import { CiCircleInfo, CiWarning } from 'react-icons/ci';
import { IoCheckmarkOutline } from 'react-icons/io5';

type AlertsType = {
  valueFields: string;
};

type AlertType = {
  status: 'success' | 'info' | 'warning' | 'error';
};

const Icons = {
  info: <CiCircleInfo />,
  success: <IoCheckmarkOutline />,
  warning: <CiWarning />,
  error: <RiErrorWarningLine />,
};

export const Alerts = ({ valueFields }: AlertsType) => {
  const t = useI18n();
  const switchAlert = (valueFields: string): AlertType => {
    switch (valueFields) {
      case "You're logged in":
      case t('Contact.success'):
      case t('NewPassword.success'):
      case t('ResetPassword.success'):
      case t('NewUser.successSending'):
      case t('DeletionPost.deleted'):
      case t('DeletionFile.deleted'):
      case t('NavForm.statusLogin'):
      case t('NavForm.successInfoRegistration'):
      case t('PasswordAccount.success'):
      case t('Forgotten.success'):
      case t('AnotherForm.uploadFile'):
      case t('Account.profile.successSending'):
        return { status: 'success' };
      case t('DeletionAccount.deletionAccount'):
      case t('DeletionPost.deleting'):
      case t('DeletionFile.deleting'):
        return { status: 'info' };
      case t('PasswordAccount.differentPasswords'):
        return { status: 'warning' };
      case t('NavForm.unVerified'):
      case 'Nie usunięto pliku.':
      case t('NavForm.notExist'):
      case t('NavForm.theSameEmail'):
      case t('AnotherForm.notUploadFile'):
      case t('ResetPassword.failed'):
      case t('NewUser.errorSending'):
      case t('EmailVerification.expired'):
      case t('unknownError'):
      case t('ResetPassword.wrongValues'):
      case t('NavForm.wrongLoginData'):
      case t('error'):
        return { status: 'error' };
      default:
        return { status: 'warning' };
    }
  };

  const status = switchAlert(valueFields).status;

  return (
    <section
      className={styles.alert}
      role="status"
      id={
        status === 'success'
          ? styles.success
          : status === 'warning'
            ? styles.warning
            : status === 'error'
              ? styles.error
              : styles.info
      }>
      <div className={styles.icon}>{Icons[status]}</div>
      <div>{valueFields}</div>
    </section>
  );
};
