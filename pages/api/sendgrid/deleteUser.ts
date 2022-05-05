import { User } from "firebase/auth";

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_KEY);

export const deleterUser = async (user: User) => {
  
  const msg = {
    to: 'piteru1910@yahoo.com',
    from: user.email,
    subject: 'Delete user account',
    html: `<strong>Delete user data about uid: ${user.uid}</strong>`,
  };
  
  const res = await sgMail.send(msg);
}

