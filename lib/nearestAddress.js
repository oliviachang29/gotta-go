const https = require('https');
// const SHEETY_API_LINK = 'https://api.sheety.co/74c7f6c1-8907-4b8e-8a65-4ab5406c0811';
const SHEETY_API_LINK = 'https://api.sheety.co/efdb6ef7-5895-45f9-b50b-d58af3504227';
// const bathroomList = require('../bathroomList.json')
const Utils = require('./utils.js')
require('dotenv').config()

function sortBathroomsByDistance( a, b ) {
  if ( a['googleMapsData']['distance']['value'] < b['googleMapsData']['distance']['value'] ){
    return -1;
  }
  if ( a['googleMapsData']['distance']['value'] > b['googleMapsData']['distance']['value'] ){
    return 1;
  }
  return 0;
}

function unpluralize(str) {
	if (str.endsWith('s')) {
		// remove last character
		return str.substring(0, str.length - 1);
	} else {
		return str;
	}
}

async function getBathroomList() {
	return new Promise(resolve => {
		https.get(SHEETY_API_LINK, (res) => {
		  res.setEncoding('utf8');
		  let rawData = '';
		  res.on('data', (chunk) => { rawData += chunk; });
		  res.on('end', () => {
		  	const parsedData = JSON.parse(rawData);
		  	console.log(parsedData)
		    resolve(parsedData)
		  });
		}).on('error', (e) => {
		  console.error(e);
		});
	});
}

async function nearestAddress(currentLocation) {
  var destinations = "";
  const bathroomList = await getBathroomList();

  for (var i = 0; i < bathroomList.length; i++) {
    destinations += Utils.replaceSpacesWithPlus(bathroomList[i]['address']) + "|";
  }

  var google_maps_link = "https://maps.googleapis.com/maps/api/distancematrix/json?"
  google_maps_link += "origins=" + Utils.replaceSpacesWithPlus(currentLocation);
  google_maps_link += "&destinations=" + destinations;
  google_maps_link += "&mode=" + "walking";
  google_maps_link += "&units=" + "imperial";
  google_maps_link += "&key=" + process.env.GOOGLE_API_KEY;

  return new Promise(resolve => {
    https.get(google_maps_link, (res) => {
	    res.setEncoding('utf8');
	    let rawData = '';
	    res.on('data', (chunk) => { rawData += chunk; });
	    res.on('end', () => {
				const distanceMatrix = JSON.parse(rawData);
				const responseElements = distanceMatrix['rows'][0]['elements'];
				const destinationAddresses = distanceMatrix['destination_addresses'];
				var numBathrooms = responseElements.length < 3 ? responseElements.length : 3

				var responseText = "";
				const bathrooms = []
				if (numBathrooms > 0) {

					for (var i = 0; i < responseElements.length; i++) {
						bathrooms.push({
							"address": destinationAddresses[i],
							"googleMapsData": responseElements[i],
							"bathroomListData": bathroomList[i]
						})
					}

					bathrooms.sort(sortBathroomsByDistance);

					responseText += `Found ${numBathrooms} bathrooms:\n`;
					// rows are sorted by the order in which you plugged in the destinations
					for (var i = 0; i < numBathrooms; i++) {
						responseText += `\n${i + 1}`
						responseText += ` - ${bathrooms[i]['googleMapsData']['distance']['text']} away.`
						responseText += ` ${bathrooms[i]['bathroomListData']['address']}.`
						responseText += ` ${unpluralize(bathrooms[i]['googleMapsData']['duration']['text'])} walk.`
						if (bathrooms[i]['bathroomListData']['private']) {
							responseText += " Private bathroom."
						} else {
							responseText += " Public bathroom."
						}
					}

					responseText += "\n\nReply with bathroom # for more info, or reply with new address to start over"
				} else {
					responseText += "Couldn't find any bathrooms. Try a more specific location."
				}

				const response = {
					text: responseText,
					numBathrooms: numBathrooms,
					currentLocation: distanceMatrix['origin_addresses'][0]
				}

				if (bathrooms.length > 0) {
					response['bathrooms'] = bathrooms.slice(0, numBathrooms)
				}

				resolve(response);
	    });
	  }).on('error', (e) => {
	  	console.error(e);
	  	return "Error";
		});
  });
  
}

module.exports = nearestAddress;