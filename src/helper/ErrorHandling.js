const Cawer = require('cawer')
const cawer = new Cawer()

async function handleRequestError(err, throttleSleepTime) {
	if (err.response.status === 503) {
		console.log(`Error 503: Request is throttled, sleeping for ${throttleSleepTime} seconds and trying again`)
		await cawer.sleep(throttleSleepTime)

		return true
	} if (err.Error && err.Error.message === 'socket hang up') {
		console.log(`Socket hanged up, trying again in ${throttleSleepTime} seconds`)
		await cawer.sleep(throttleSleepTime)

		return true
	}

	return false
}

function throttleRequest(throttleSleepTime) {
	console.log(`Request is throttled, sleeping for ${throttleSleepTime} seconds and trying again`)
	cawer.sleep(throttleSleepTime)
}

module.exports = {
	handleRequestError, throttleRequest,
}
