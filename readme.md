# GottaGo

Text your current location to 805TOILET3 to try it out.

<img src="https://oliviachang.me/assets/images/playground/gotta-go@2x.png">

San Francisco is in the midst of a housing crisis. While technology has brought riches to some, it's left a lot of longtime San Francisco residents unable to afford the rising cost of living. As a result, San Francisco's homeless population has been on the rise.

Almost 75% of homeless people own phones, but of those who own phones, only 32% own a smartphone. The rest own a "dumbphone" without internet access.

A whole host of bathroom finding apps and websites already exist. But because most homeless own phones dumbphones which unable to access the internet, all of these services are unavailable.

And even for those who do own a smartphone, downloading apps and accessing websites consumes a lot of data. Most homeless people are on limited data plans and can't afford to use that much data.

That's why I created Gotta Go. It's a text-message only service for finding nearby bathrooms, with an emphasis on bathrooms that are accessible for those with disabilities. Since it is SMS only, Gotta Go is substantially cheaper than the cost of a data plan.

## How it works

1. User texts current location to 805TOILET3 (don't need to convert to digits on iPhone)
2. Gotta Go responds with nearest 3 bathrooms
3. User replies with the number of the bathroom
4. Gotta Go sends more information on the selected bathroom, including the bathroom provider, hours of operation, and whether the bathroom is accessible for those with disabilities.
5. User replies with “DIR”
6. Gotta Go sends a list of directions to the selected toilet.

# Development
```
yarn
node server.js
ngrok http 1337
```

# Deployment

1. Push to Github
2. `npm run deploy`