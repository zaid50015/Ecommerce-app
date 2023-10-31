const nodemailer = require("nodemailer");
const sendEmail = async ({to,subject,text,html}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure:true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: '"Zapkart" <Zapkart@ecommerce.com>',
    to: to,
    subject: subject, 
    text: text,
    html:html
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};
module.exports = sendEmail;