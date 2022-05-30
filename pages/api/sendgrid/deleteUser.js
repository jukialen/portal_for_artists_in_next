const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_KEY);

export default async (req, res) => {
  console.log('req', req);
  
  const msg = {
    to: 'info@pfartists.xyz',
    from: req.body.email,
    subject: 'Delete user account',
    title: `Delete user data about uid: ${req.body.uid}`,
  };
  
  console.log('deleting user', msg);
  
  console.log(res);
  try {
    const response = await sgMail.send(msg);
    console.log('status code', response[0].statusCode);
    console.log('headers', response[0].headers);
  } catch (e) {
    console.log(e);
  }
  return res.status(200).json({ 'status': 'ok' });
}

