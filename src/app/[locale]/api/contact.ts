import { NextApiRequest, NextApiResponse } from 'next';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: process.env.NEXT_PUBLIC_MAILERSEND_API_KEY!,
});

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  const sentFrom = new Sender(process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!, 'Form Pfartists');

  const recipients = [new Recipient(process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!, 'To Pfartists')];
  try {
    const messageText: string[] = req.body.message.split('\n');

    const personalisations = [
      {
        email: process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!,
        data: {
          tags: req.body.tags,
          message: messageText,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(req.body.title)
      .setPersonalization(personalisations)
      .setTemplateId(process.env.NEXT_PUBLIC_FEEDBACK_TEMPLATE_ID!);

    console.log('personalisations', personalisations[0].data);
    console.log('emailParams', emailParams);
    await mailerSend.email.send(emailParams);

    return res.status(200).json({ error: '' });
  } catch (e) {
    return res.status(500).json({ error: JSON.stringify(e) });
  }
}

export default sendEmail;
