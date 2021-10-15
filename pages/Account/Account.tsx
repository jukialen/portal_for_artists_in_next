import React, { useEffect } from 'react';
import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import './Account.module.scss';

import { useRouter } from 'next/router';

function Account() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = window.localStorage.getItem('user');

      !user && router.push('/');
    }
  }, [router]);

  return (
    <section className="workspace">
      <h2 className="account__h2">Konto</h2>

      <AccountMenu />

      <AccountData />

      <GalleryAccount />

      <ProfileAccount />
    </section>
  );
}

export default Account;
