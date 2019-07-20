function moreInfo(bathroom) {
	if (bathroom) {
		let responseText = "";
		const hours = bathroom['bathroomListData']['hours'];
		const days = bathroom['bathroomListData']['days'];
		const provider = bathroom['bathroomListData']['provider'];
		const area = bathroom['bathroomListData']['area'];
		const accessible = bathroom['bathroomListData']['accessibleForDisabilities'];

		if (hours && days) {
			responseText += `Open ${hours}, ${days}.`
		}
		if (provider) {
			responseText += ` Provider: ${provider} i`
		} else {
			responseText += " I"
		}
		if (area) {
			responseText += `n ${area}.`
		}
		if (accessible !== null) {
			responseText += ` Disability accessible: ${accessible ? "Yes" : "No" }.`
		}
		responseText += " Text DIR for directions, or a new address to start over."
		return responseText;
	} else {
		return "Text an address to get nearby bathrooms."
	}
}

module.exports = moreInfo;