import { NextApiRequest, NextApiResponse } from 'next';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { feedbackEmail, feedbackEmailTemplateId, mailerApiKey } from 'constants/links';

const mailerSend = new MailerSend({
  apiKey: mailerApiKey!,
});

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  const sentFrom = new Sender(feedbackEmail!, 'Form Pfartists');

  const recipients = [new Recipient(feedbackEmail!, 'To Pfartists')];
  try {
    const messageText: string[] = req.body.message.split('\n');

    const personalisations = [
      {
        email: feedbackEmail!,
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
      .setTemplateId(feedbackEmailTemplateId!);

    console.log('personalisations', personalisations[0].data);
    console.log('emailParams', emailParams);
    await mailerSend.email.send(emailParams);

    return res.status(200).json({ error: '' });
  } catch (e) {
    return res.status(500).json({ error: JSON.stringify(e) });
  }
}

export default sendEmail;
