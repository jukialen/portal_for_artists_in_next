import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_KEY!);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    const messageText = req.body.message.split('\n');

    const messageJs = messageText.map((text: string) => `<p style="margin: 0;">${text}</p>`).join('');

    const msg = {
      to: `${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`,
      from: `${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`,
      subject: `${req?.body?.tags}: ${req?.body?.title}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>User sent ${req.body.tags}</title>
          <meta name="description" content="User snet ${req.body.tags}">
          <meta name="author" content="jukialen">
          <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
          <link rel="stylesheet" href="css/styles.css?v=1.0">
        </head>
        <body>
          <div class="container" style="margin-left: 20px;margin-right: 20px;">
            <div style="font-size: 16px;line-height: 1.6;">
            ${messageJs}
            </div>
          </div>
        </body>
      </html>`,
    };

    sgMail
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
}

export default sendEmail;
