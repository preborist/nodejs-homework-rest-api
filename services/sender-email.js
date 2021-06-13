const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const senderConfig = require('../config/sender-config');
require('dotenv').config();

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    return await sgMail.send({ ...msg, from: senderConfig.email.sendgrid });
  }
}
class CreateSenderNodemailer {
  async send(msg) {
    const options = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: senderConfig.email.nodemailer,
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(options);
    const emailOptions = {
      from: senderConfig.email.nodemailer,
      ...msg,
    };

    return await transporter.sendMail(emailOptions);
  }
}

module.exports = { CreateSenderNodemailer, CreateSenderSendgrid };
