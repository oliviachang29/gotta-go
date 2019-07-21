const nearestAddress = require('./lib/nearestAddress')
const moreInfo = require('./lib/moreInfo')
const getDirections = require('./lib/getDirections')
const currentLocation = "Exploratorium San Francisco";
const destination = "170 O'Farrell Street, 6th Floor"

async function asyncCall() {
  const response = await nearestAddress(currentLocation);
  console.log(response.text)
  console.log(moreInfo(response.bathrooms[0]))
  // const response = await getDirections(currentLocation, destination);
  // console.log(response)
}

asyncCall();