const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhruvsutar779@gmail.com", // your email
    pass: "nygz rgti ygrq ablk", // your app password
  },
});

module.exports = transporter;
