const axios = require('axios');

const alexaRequest = {
  version: "1.0",
  session: {
    new: true,
    sessionId: "amzn1.echo-api.session.1234567890",
    application: {
      applicationId: "amzn1.ask.skill.123456"
    },
    user: {
      userId: "amzn1.ask.account.1234567890"
    }
  },
  request: {
    type: "IntentRequest",
    requestId: "amzn1.echo-api.request.1234567890",
    intent: {
      name: "OrderIntent",
      slots: {
        item: {
          name: "item",
          value: "PaperBag"
        }
      }
    }
  }
};

axios.post('https://greenloop-67y2.onrender.com/alexa/order', alexaRequest)
  .then(response => {
    console.log('Alexa Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
