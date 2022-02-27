import { Alert, AlertIcon } from '@chakra-ui/react';
import { useHookSWR } from 'hooks/useHookSWR';

type AlertsType = {
  valueFields: string
};

export const Alerts = ({ valueFields }: AlertsType) => {
  const data = useHookSWR();
  
  const switchAlert = (valueFields: string) => {
    let status: string;
    
    switch (valueFields) {
      case data?.NavForm?.statusLogin:
      case data?.NavForm?.successInfoRegistration:
      case data?.PasswordAccount?.success:
      case data?.Forgotten?.success:
      case data?.AnotherForm?.uploadFile:
      case data?.Account?.profile?.successSending:
        return status = 'success';
      case 'Upload is running':
        return status = 'info';
      case data?.NavForm?.unVerified:
      case data?.PasswordAccount?.differentPasswords:
      case 'Upload is paused':
        return status = 'warning';
      case data?.NavForm?.setErrorMessageLogin:
      case data?.NavForm?.theSameEmail:
      case data?.AnotherForm?.notUploadFile:
      case data?.error:
        return status = 'error'
    }
  };
  
  const switchAlertColor = (valueFields: string) => {
    let color: string;
    
    switch (valueFields) {
      case data?.NavForm?.statusLogin:
      case data?.NavForm?.successInfoRegistration:
      case data?.PasswordAccount?.success:
      case data?.Forgotten?.success:
      case data?.AnotherForm?.uploadFile:
      case data?.Account?.profile?.successSending:
        return color = 'green';
      case 'Upload is running':
        return color = 'blue';
      case data?.NavForm?.unVerified:
      case data?.PasswordAccount?.differentPasswords:
      case 'Upload is paused':
        return color = 'yellow';
      case data?.NavForm?.setErrorMessageLogin:
      case data?.NavForm?.theSameEmail:
      case data?.AnotherForm?.notUploadFile:
      case data?.error:
        return color = 'red';
    }
  };
  
  return <Alert
    colorScheme={switchAlertColor(valueFields)}
    color='blackAlpha.900'
    size='sm'
    margin='1rem auto'
    width='17.5rem'
    status={switchAlert(valueFields)}
    variant='left-accent'
    fontSize='md'
  >
    <AlertIcon />
    {valueFields}
  </Alert>;
};