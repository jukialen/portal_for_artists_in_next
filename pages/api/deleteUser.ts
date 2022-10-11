import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_KEY!);

const deleterUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const msg = {
      to: `${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`,
      from: `${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`,
      subject: 'Delete user account',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>User sent ${req.body.tags}</title>
          <meta name="description" content="User ${req.body.uid} wants to delete your own account">
          <meta name="author" content="jukialen">
          <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
          <link rel="stylesheet" href="css/styles.css?v=1.0">
        </head>
        <body>
          <div class="container" style="margin-left: 20px;margin-right: 20px;">
            <div style="font-size: 16px;line-height: 1.6;">
            Hi,
            <br />
            Delete user data about uid: ${req.body.uid}.
            <br />
            User email: ${req.body.email}
            </div>
          </div>
        </body>
      </html>`,
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
    return res.status(e.statusCode || 500).json({ error: e.message });
  }
  return res.status(200).json({ error: '' });
};

export default deleterUser;
