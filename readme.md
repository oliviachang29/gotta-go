<img src="https://oliviachang.me/assets/images/playground/gotta-go@2x.png">

## Housing crisis

San Francisco is in the midst of a housing crisis. While technology has brought riches to some, it's left a lot of longtime San Francisco residents unable to afford the rising cost of living. As a result, San Francisco's homeless population has been on the rise.

Almost 75% of homeless people own phones, but of those who own phones, only 32% own a smartphone. The rest own a "dumbphone" without internet access.

A whole host of bathroom finding apps and websites already exist. But because most homeless own phones dumbphones which unable to access the internet, all of these services are unavailable.

And even for those who do own a smartphone, downloading apps and accessing websites consumes a lot of data. Most homeless people are on limited data plans and can't afford to use that much data.

That's why I created Gotta Go. It's a text-message only service for finding nearby bathrooms, with an emphasis on bathrooms that are accessible for those with disabilities. Since it is SMS only, Gotta Go is substantially cheaper than the cost of a data plan.

## How it works

1. User texts current location to 1 (805) TOILET3
2. Gotta Go responds with nearest 3 bathrooms
3. User replies with the number of the bathroom
4. Gotta Go sends more information on the selected bathroom, including the bathroom provider, hours of operation, and whether the bathroom is accessible for those with disabilities.
5. User replies with “DIR”
6. Gotta Go sends a list of directions to the selected toilet.

## How I built it

Gotta Go is built with Node.js. Gotta Go uses Twilio to send and receive messages. I created my own API to get a list of bathrooms using a Google Sheet (https://docs.google.com/spreadsheets/d/14JH3oppOMSWAjrhFFULOevAbfFLYh1NdoDW_aIjlr70/edit?usp=sharing), and then I used the Google Directions and Distance Matrix APIs to determine the closest bathroom.

## What's next for Gotta Go

* Expanding the list of the available bathrooms (there are 50 at the moment), and making Gotta Go available to other major cities.
* Spreading the word!