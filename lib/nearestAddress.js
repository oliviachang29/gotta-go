const https = require('https');
const SHEETY_API_LINK = 'https://api.sheety.co/74c7f6c1-8907-4b8e-8a65-4ab5406c0811';
const bathroomList = require('../bathroomList.json')
require('dotenv').config()

function replaceSpacesWithPlus(str) {
    return str.split(" ").join("+");
}

function sortBathroomsByDistance( a, b ) {
  if ( a['googleMapsData']['distance']['value'] < b['googleMapsData']['distance']['value'] ){
    return -1;
  }
  if ( a['googleMapsData']['distance']['value'] > b['googleMapsData']['distance']['value'] ){
    return 1;
  }
  return 0;
}

function getBathroomList() {
    // return https.get(SHEETY_API_LINK, (res) => {
    //   res.setEncoding('utf8');
    //   let rawData = '';
    //   res.on('data', (chunk) => { rawData += chunk; });
    //   res.on('end', () => {
    //     try {
    //       return JSON.parse(rawData);
    //     } catch (e) {
    //       console.error(e.message);
    //     }
    //   });
    // }).on('error', (e) => {
    //   console.error(e);
    // });
    return bathroomList;
}

async function nearestAddress(currentLocation) {
  var destinations = "";
  const bathroomList = getBathroomList();

  for (var i = 0; i < bathroomList.length; i++) {
    destinations += replaceSpacesWithPlus(bathroomList[i]['address']) + "|";
  }

  var google_maps_link = "https://maps.googleapis.com/maps/api/distancematrix/json?"
  google_maps_link += "origins=" + replaceSpacesWithPlus(currentLocation);
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
				if (numBathrooms > 0) {

					const bathrooms = []
					for (var i = 0; i < responseElements.length; i++) {
						bathrooms.push({
							"address": destinationAddresses[i],
							"googleMapsData": responseElements[i],
							"bathroomListData": bathroomList[i]
						})
					}

					bathrooms.sort(sortBathroomsByDistance);

					responseText += `Found ${numBathrooms} bathrooms:`;
					// rows are sorted by the order in which you plugged in the destinations
					for (var i = 0; i < numBathrooms; i++) {
						responseText += `\n${i + 1}`
						responseText += ` - ${bathrooms[i]['googleMapsData']['distance']['text']} away.`
						responseText += ` ${bathrooms[i]['address']}.`
						responseText += ` ${bathrooms[i]['googleMapsData']['duration']['text']} walking.`
						if (bathrooms[i]['bathroomListData']['private']) {
							responseText += " Private bathroom."
						} else {
							responseText += " Public bathroom."
						}
					}

					responseText += "\nRespond with the bathroom number to get more information."
				} else {
					responseText += "Couldn't find any bathrooms. Try a more specific location."
				}

				resolve(responseText);
	    });
	  }).on('error', (e) => {
	  	console.error(e);
	  	return "Error";
		});
  });
  
}

module.exports = nearestAddress;