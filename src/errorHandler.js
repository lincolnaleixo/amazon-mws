const moment = require('moment')

/**
 * Class to handle all API errors
 */
class ErrorHandler {

	/**
     * ErrorHandler constructor
     * @param {Object} logger
     * @param {Object} cawer
     */
	constructor(logger, cawer) {
		this.logger = logger
		this.cawer = cawer
	}

	/**
     * @param {number} backOffTimer
     * @param {{ responseText: any; responseStatusCode: any; }} responseInfo
     */
	isResponseValid(responseInfo, backOffTimer) {
		try {
			const responseStatus = responseInfo.responseStatusCode
			if (responseStatus === 200) return 'ok'

			const errorMessage = responseInfo.responseText.ErrorResponse.Error.Message
			if (responseStatus === 503) {
				if (errorMessage.indexOf('You exceeded your quota') > -1) {
					const dateResetString = errorMessage.split('Your quota will reset on')[1].trim()
					const dateReset = moment.utc(dateResetString)
						.format('YYYY-MM-DD:HH:mm:ss')
					const dateNow = moment()
						.utc()
						.format('YYYY-MM-DD:HH:mm:ss')
					const duration = moment.duration(moment(dateReset)
						.diff(moment(dateNow)))
					const minutes = duration.asMinutes()
					const sleepSeconds = minutes * 60 + 10

					this.logger.error(`${errorMessage} (${responseStatus}).`)
					this.logger.warn(`Will try again in ${sleepSeconds} seconds`)

					this.cawer.sleep(sleepSeconds)
				} else {
					this.logger.error(`${errorMessage}${responseStatus ? ` (${responseStatus})` : ''}`)
					this.logger.warn(`Trying again in ${backOffTimer} seconds`)

					this.cawer.sleep(backOffTimer)
				}

				return 'retry'
			}
		} catch (error) {
			this.logger.error(`Error on handleResponseErrors: ${error}`)
		}

		return 'exception'
	}
}
module.exports = ErrorHandler
