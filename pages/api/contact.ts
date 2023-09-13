import { NextApiRequest, NextApiResponse } from 'next';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

import sgMail from '@sendgrid/mail';
import axios from 'axios';

sgMail.setApiKey(process.env.SENDGRID_KEY!);

const mailerSend = new MailerSend({
  apiKey: process.env.NEXT_PUBLIC_MAILERSEND_API_KEY!,
});

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  const sentFrom = new Sender(process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!, 'Form Pfartists');

  const recipients = [new Recipient(process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!, 'To Pfartists')];
  try {
    const messageText: string[] = req.body.message.split('\n').join('\n');

    const personalisations = [
      {
        email: process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!,
        data: {
          tags: req.body.tags,
          message: messageText,
        },
      },
    ];

    await axios.post(`${process.env.NEXT_PUBLIC_WEBHOOK_URL}`, {
      text: `*title:* ${req.body.title}\n\n*message:*\n_${messageText}_ \n\n*tag:* ${req.body.tags}`,
    });

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(req.body.title)
      .setPersonalization(personalisations)
      .setTemplateId(process.env.NEXT_PUBLIC_FEEDBACK_TEMPLATE_ID!);

    await mailerSend.email.send(emailParams);

    //  @ts-ignore
  } catch (e: { statusCode: number; message: string }) {
    return res.status(e.statusCode || 500).json({ error: e.message });
  }

  return res.status(200).json({ error: '' });
}

export default sendEmail;
