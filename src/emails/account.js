const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'suhelkhan275@gmail.com',
    subject: 'Thanks for joinig in !',
    text: `Welcome to the app , ${name}, Let me know how you get along with the app .`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'suhelkhan275@gmail.com',
    subject: 'How was your experience with us !',
    text: `All the best ,${name} , give us the reason of your cancelation .`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
