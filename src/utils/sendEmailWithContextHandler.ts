import sgMail from '@sendgrid/mail';

export default async function sendEmailWithContextHandler(
  templateData: any,
  sendToEmail: string,
  emailFrom: string,
  templateId: string,
  attachments?: any
) {
  try {
    const apiKey = process.env.SEND_GRID_API_KEY ? process.env.SEND_GRID_API_KEY : '';
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      to: sendToEmail,
      from: emailFrom,
      dynamicTemplateData: templateData,
      templateId: templateId,
      attachments,
      bcc: 'emaillogs@30mins.com',
    });
  } catch (err) {
    console.log('sendEmailWithContextHandler err: ', err.message);
    throw err;
  }
}
