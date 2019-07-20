const https = require('https');
const Utils = require('./utils.js')
require('dotenv').config()
var striptags = require('striptags');

function addSpaceBeforeWord(str, word) {
	if (str.indexOf(word) > 0) {
		str = str.slice(0, str.indexOf(word)) + ". " + str.slice(str.indexOf(word));
	}
	return str;
}

function formatInstruction(str) {
	str = addSpaceBeforeWord(str, "Destination");
	str = addSpaceBeforeWord(str, "Pass");
	str = str.replace("&nbsp;", " ")
	return striptags(str);
}

async function getDirections(origin, destination) {

  var google_maps_link = "https://maps.googleapis.com/maps/api/directions/json?"
  google_maps_link += "origin=" + Utils.replaceSpacesWithPlus(origin);
  google_maps_link += "&destination=" + Utils.replaceSpacesWithPlus(destination);
  google_maps_link += "&mode=" + "walking";
  google_maps_link += "&units=" + "imperial";
  google_maps_link += "&key=" + process.env.GOOGLE_API_KEY;

  return new Promise(resolve => {
    https.get(google_maps_link, (res) => {
    	const { statusCode } = res;

		let error;
		if (statusCode !== 200) {
			if (statusCode == "ZERO_RESULTS") {
				return "No routes exist between current location and bathroom."
			} else if (statusCode == "MAX_ROUTE_LENGTH_EXCEEDED") {
				return "No routes exist between current location and bathroom."
			}
		}

	    res.setEncoding('utf8');
	    let rawData = '';
	    res.on('data', (chunk) => { rawData += chunk; });
	    res.on('end', () => {
	    	const parsedData = JSON.parse(rawData);
			const steps = parsedData["routes"][0]["legs"][0]["steps"]
			let responseText = "";
			for (var i = 0; i < steps.length; i++) {
				responseText += `\n${i+1}. ${formatInstruction(steps[i]["html_instructions"])}`;
			}
			const response = {
				text: responseText
			}
			resolve(response);
	    });
	  }).on('error', (e) => {
	  	console.error(e);
	  	return "Error";
		});
  });
  
}

module.exports = getDirections;