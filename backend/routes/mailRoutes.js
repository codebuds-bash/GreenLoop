const express = require("express");
const router = express.Router();
const { sendOrderConfirmationMail } = require("../controllers/mailController");

router.post("/send-confirmation", sendOrderConfirmationMail);

module.exports = router;
