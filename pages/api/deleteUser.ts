import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_KEY!);

const deleterUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const msg = {
      to: `${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`,
      from: req.body.email,
      subject: 'Delete user account',
      html: `<strong>Delete user data about uid: ${req.body.uid}</strong>`,
      headers: {
        'access-control-allow-origin': `${process.env.NEXT_PUBLIC_PAGE}`,
      },
    };

    await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((e) => {
        console.error('e', e);
      });
    //  @ts-ignore
  } catch (e: { statusCode: number; message: string }) {
    // console.log(e);
    // console.log('s', res.status);
    return res.status(e.statusCode || 500).json({ error: e.message });
  }

  // console.log(res);
  return res.status(200).json({ error: '' });
};

export default deleterUser;
