import { useI18n } from 'locales/client';

import { Alert } from 'components/ui/alert';

type AlertsType = {
  valueFields: string;
};

type AlertType = {
  status: 'success' | 'info' | 'warning' | 'error';
  color: 'green.500' | 'blue.500' | 'yellow.500' | 'red.500';
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
        return { status: 'success', color: 'green.500' };
      case t('DeletionAccount.deletionAccount'):
      case t('DeletionPost.deleting'):
      case t('DeletionFile.deleting'):
        return { status: 'info', color: 'blue.500' };
      case t('PasswordAccount.differentPasswords'):
        return { status: 'warning', color: 'yellow.500' };
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
        return { status: 'error', color: 'red.500' };
      default:
        return { status: 'warning', color: 'yellow.500' };
    }
  };

  const status = switchAlert(valueFields).status;
  const color = switchAlert(valueFields).color;

  return (
    <Alert
      title={valueFields}
      status={status}
      backgroundColor={color}
      color="blackAlpha.700"
      size="sm"
      margin="1rem auto"
      padding="1rem 2rem"
      width="fit-content"
      maxWidth="20.5rem"
      fontSize="md"
      position="absolute"
      bottom="-6rem"
      right={0}
      left={0}
      zIndex={1}
    />
  );
};
