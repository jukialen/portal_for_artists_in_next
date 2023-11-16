

import { Alert, AlertIcon } from '@chakra-ui/react';
import { useI18n } from "../../../locales/client";

type AlertsType = {
  valueFields: string;
};

export const Alerts = ({ valueFields }: AlertsType) => {
  const t = useI18n();
  const switchAlert = (valueFields: string) => {
    let status: string;

    switch (valueFields) {
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
        return (status = 'success');
      case t('DeletionAccount.deletionAccount'):
      case t('DeletionPost.deleting'):
      case t('DeletionFile.deleting'):
        return (status = 'info');
      case t('NavForm.unVerified'):
      case t('PasswordAccount.differentPasswords'):
        return (status = 'warning');
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
        return (status = 'error');
      default:
        return (status = 'warning');
    }
  };

  const switchAlertColor = (valueFields: string) => {
    let color: string;

    switch (valueFields) {
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
        return (color = 'green');
      case t('DeletionAccount.deletionAccount'):
      case t('DeletionPost.deleting'):
      case t('DeletionFile.deleting'):
        return (color = 'blue');
      case t('NavForm.unVerified'):
      case t('PasswordAccount.differentPasswords'):
        return (color = 'yellow');
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
        return (color = 'red');
      default:
        return (color = 'yellow');
    }
  };

  return (
    <Alert
      colorScheme={switchAlertColor(valueFields)}
      color="blackAlpha.900"
      size="sm"
      margin="1rem auto"
      width="17.5rem"
      status={switchAlert(valueFields)}
      variant="left-accent"
      fontSize="md">
      <AlertIcon />
      {valueFields}
    </Alert>
  );
};