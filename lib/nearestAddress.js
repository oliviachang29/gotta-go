const https = require('https');
const SHEETY_API_LINK = 'https://api.sheety.co/74c7f6c1-8907-4b8e-8a65-4ab5406c0811';
const bathroomList = require('../bathroomList.json')
require('dotenv').config()

function replaceSpacesWithPlus(str) {
    return str.split(" ").join("+");
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

function getDistanceMatrix(currentLocation, destinations) {
  var google_maps_link = "https://maps.googleapis.com/maps/api/distancematrix/json?"
  google_maps_link += "origins=" + replaceSpacesWithPlus(currentLocation);
  google_maps_link += "&destinations=" + destinations;
  google_maps_link += "&mode=" + "walking";
  google_maps_link += "&units=" + "imperial";
  google_maps_link += "&key=" + process.env.GOOGLE_API_KEY;

  return https.get(google_maps_link, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
       const parsedData = JSON.parse(rawData);
       console.log(parsedData)
    });
  }).on('error', (e) => {
  	console.error(e);
  	return "Error";
	});
}

function parseData() {

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

  return https.get(google_maps_link, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
			const distanceMatrix = JSON.parse(rawData);
			const responseElements = distanceMatrix['rows'][0]['elements'];
			const destinationAddresses = distanceMatrix['destination_addresses'];
			var numBathrooms = responseElements.length < 3 ? responseElements.length : 3

			var responseText = `Found ${numBathrooms} bathrooms:`;
			// rows are sorted by value of distance - smallest to biggest
			for (var i = 0; i < numBathrooms; i++) {
				responseText += `\n${i}`
				responseText += ` - ${responseElements[i]['distance']['text']} away.`
				responseText += ` ${destinationAddresses[i]}.`
				responseText += ` ${responseElements[i]['duration']['text']} walking.`
			}

			console.log(responseText);
    });
  }).on('error', (e) => {
  	console.error(e);
  	return "Error";
	});
  
}

module.exports = nearestAddress;