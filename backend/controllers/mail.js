const nodemailer = require("nodemailer");

const sendOrderMail = async (email, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dhruvsutar779@gmail.com",         // replace with your email
      pass: "lmic gasn rnnk zxca",          // use app password (not your actual password)
    },
  });

  const mailOptions = {
    from: '"Greenloop" <dhruvsutar779@gmail.com>',
    to: email,
    subject: "Greenloop Order Confirmation",
    html: `
      <h2>Thank you for your order with Greenloop!</h2>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Product:</strong> ${orderDetails.product}</p>
      <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
      <p><strong>Total:</strong> ₹${orderDetails.total}</p>
      <p>We'll notify you once it is shipped. Stay green 🌿</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderMail };
