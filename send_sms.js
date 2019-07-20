require('dotenv').config()
const SHEETY_API = "https://api.sheety.co/74c7f6c1-8907-4b8e-8a65-4ab5406c0811";

// twilio
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+18058645383',
     to: '+16507401247'
   })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(err))