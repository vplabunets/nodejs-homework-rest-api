require("dotenv").config();
const sgMail = require("@sendgrid/mail");

function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "httpError";
    this.status = status;
    this.message = message;
  }
}
// {
//   to, subject, text, html;
// }
async function sendMail({ to, subject, text, html }) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to, // Change to your recipient
    from: "vplabunets@ukr.net", // Change to your verified sender
    subject,
    text,
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  CustomError,
  tryCatchWrapper,
  sendMail,
};
