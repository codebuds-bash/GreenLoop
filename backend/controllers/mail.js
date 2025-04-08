const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "greenloopcompostable@gmail.com", // your email
    pass: "fobt rocg jvgq omsa", // your app password
  },
});

module.exports = transporter;
