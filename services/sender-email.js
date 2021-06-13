const sgMail = require('@sendgrid/mail');
const senderConfig = require('../config/sender-config');
require('dotenv').config();

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    return await sgMail.send({ ...msg, from: senderConfig.email.sendgrid });
  }
}

module.exports = { CreateSenderSendgrid };
