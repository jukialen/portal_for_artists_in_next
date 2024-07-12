'use client'

import Link from "next/link";
import { useScopedI18n } from "locales/client";

import { UserType } from "types/global.types";

import { ContactForm } from "components/atoms/ContactForm/ContactForm";

import styles from './ContactContainer.module.scss';

type ContactContainerType = { locale: string, userData: UserType }
export const ContactContainer = ({ locale, userData }: ContactContainerType) => {
  const tContact = useScopedI18n('Contact');
  
  return (
    <div className={userData?.pseudonym ? styles.site__without__footer : styles.site}>
      <div className={styles.container}>
        <div className={styles.welcomeContainer}>
          <h2 className={styles.title}>{tContact('title')}</h2>
          
          <p className={styles.subTitle}>{tContact('subTitleFirst')}</p>
          
          <p>
            {tContact('toFAQ')}
            <Link href={`${locale}/faq`}>{tContact('toFAQHere')}</Link>
            {tContact('dot')}
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}