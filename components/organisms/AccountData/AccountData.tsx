import { SubscriptiomAccountData } from 'components/molecules/SubscriptiomAccountData/SubscriptiomAccountData';
import { MailAccountData } from 'components/molecules/MailAccountData/MailAccountData';
import { PasswordAccountData } from 'components/molecules/PasswordAccountData/PasswordAccountData';

import './AccountData.module.scss';

export const AccountData = () => {
  return (
    <article id="account__data" className="account__data">
      <SubscriptiomAccountData />

      <MailAccountData />

      <PasswordAccountData />
    </article>
  );
};
