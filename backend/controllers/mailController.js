const transporter = require("./mail");

const sendOrderConfirmationMail = async (req, res) => {
  const { name, email, orderId, product, quantity, total, imageUrl } = req.body;

  if (!name || !email || !orderId || !product || !quantity || !total || !imageUrl) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const mailOptions = {
    from: '"Greenloop" <greenloopcompostable@gmail.com>',
    to: email,
    subject: "Greenloop Order Confirmation",
    html: `
      <h2>Thank you for your order with Greenloop, ${name}!</h2>
      <img src="${imageUrl}" alt="${product}" style="max-width: 300px; border-radius: 8px;" />
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Product:</strong> ${product}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Total:</strong> ₹${total}</p>
      <p>We'll notify you once it is shipped. Stay green 🌿</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Email failed", error: error.message });
  }
};

module.exports = { sendOrderConfirmationMail };
