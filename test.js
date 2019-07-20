const nearestAddress = require('./lib/nearestAddress')
var currentLocation = 'Union Square';

async function asyncCall() {
  console.log('calling');
  const response = await nearestAddress(currentLocation);
  console.log(response);
}

asyncCall();