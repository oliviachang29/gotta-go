const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const nearestAddress = require('./lib/nearestAddress')
const getDirections = require('./lib/getDirections')
const moreInfo = require('./lib/moreInfo')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/sms', (req, res) => {
	(async() => {
		console.log('received message')
	  // get message body
		const messageBody = req.body.Body;

		const twiml = new MessagingResponse();

		if (req.cookies.cachedBathrooms !== undefined && !isNaN(messageBody)) {
			console.log('cached bathrooms')
			console.log(req.cookies.cachedBathrooms)

			const selectedBathroom = req.cookies.cachedBathrooms[messageBody];
			const response = moreInfo(selectedBathroom)
			twiml.message(response)

			res.cookie('selectedBathroom', selectedBathroom, { maxAge: 1000 * 60 * 60 });
		} else if (req.cookies.selectedBathroom !== undefined && messageBody === "DIR") {
			console.log("Getting directions.")
			const destination = req.cookies.selectedBathroom['address']
			const response = await getDirections(req.cookies.currentLocation, destination);
			twiml.message(response.text);
		} else {
			console.log('getting nearest address')
			const response = await nearestAddress(messageBody);
			if (response.numBathrooms > 0) {
				res.cookie('cachedBathrooms', response.bathrooms, { maxAge: 1000 * 60 * 60 });
				res.cookie('currentLocation', response.currentLocation, { maxAge: 1000 * 60 * 60 });
			}

			twiml.message(response.text);
		}

		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
	  
	})();
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});