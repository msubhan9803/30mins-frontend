import fs from 'fs';
import sgMail from '@sendgrid/mail';

export default async function sendEmail(
  templateData: any,
  sendToEmail: string,
  emailFrom: string,
  templateId: string,
  attachment?: any
) {
  try {
    const apiKey = process.env.SEND_GRID_API_KEY ? process.env.SEND_GRID_API_KEY : '';

    sgMail.setApiKey(apiKey);

    if (attachment) {
      const attachment64 = fs.readFileSync(attachment.filepath).toString('base64');
      await sgMail.send({
        to: sendToEmail,
        from: emailFrom,
        dynamicTemplateData: templateData,
        templateId: templateId,
        attachments: [
          {
            content: attachment64,
            filename: attachment.originalFilename,
            type: attachment.mimetype,
            disposition: 'attachment',
          },
        ],
      });
      return;
    }

    await sgMail.send({
      to: sendToEmail,
      from: emailFrom,
      dynamicTemplateData: templateData,
      templateId: templateId,
      bcc: 'emaillogs@30mins.com',
    });
  } catch (err) {
    console.log('sendEmail err: ', err.message);
    throw err;
  }
}
