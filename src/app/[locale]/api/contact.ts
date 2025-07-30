import { NextRequest, NextResponse } from 'next/server';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

import { feedbackEmail, feedbackEmailTemplateId, mailerApiKey } from 'constants/links';
import { Tags } from 'types/global.types';

const mailerSend = new MailerSend({ apiKey: mailerApiKey! });

type MesssageType = {
  title: string;
  message: string;
  tags: Tags;
};

export async function POST(req: NextRequest) {
  const sentFrom = new Sender(feedbackEmail!, 'Form Pfartists');
  const recipients = [new Recipient(feedbackEmail!, 'To Pfartists')];

  try {
    const messageText: MesssageType = await req.json();

    const message = messageText.message.split('\n');
    const personalisations = [
      {
        email: feedbackEmail!,
        data: {
          tags: messageText.tags,
          message,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(messageText.title)
      .setPersonalization(personalisations)
      .setTemplateId(feedbackEmailTemplateId!);

    console.log('personalisations', personalisations[0].data);
    console.log('emailParams', emailParams);
    await mailerSend.email.send(emailParams);

    return NextResponse.json({ error: '' });
  } catch (e) {
    return NextResponse.json({ error: JSON.stringify(e) });
  }
}
