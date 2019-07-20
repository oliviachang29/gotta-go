const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const nearestAddress = require('./lib/nearestAddress')
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
	(async() => {
	  console.log('before start');

	  // get message body
		const messageBody = req.body.Body;

		const twiml = new MessagingResponse();

		const response = await nearestAddress(messageBody);
		twiml.message(response);

		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
	  
	  console.log('after start');
	})();
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});