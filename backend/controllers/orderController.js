const { sendOrderMail } = require('./mail');

const placeOrder = async (req, res) => {
  try {
    const { email, product, quantity, total } = req.body;

    // Your logic to save order in DB
    const orderId = Math.floor(Math.random() * 1000000); // just example

    // Send email
    await sendOrderMail(email, { orderId, product, quantity, total });

    res.status(200).json({ success: true, message: 'Order placed and email sent.' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};

module.exports = { placeOrder };
