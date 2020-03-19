const crypto = require('crypto')
const moment = require('moment')
const requiredParams = require('../resources/requiredParams.json')

class Core {

	getRequiredParams(action, api, credentials) {

		requiredParams.Defaults.Timestamp = moment()
			.toISOString()

		requiredParams.Defaults.AWSAccessKeyId = credentials.accessKeyId
		requiredParams.Defaults.SellerId = credentials.sellerId
		requiredParams.Defaults.Action = action

		this.apiVersion = { Version: requiredParams[api].version }

		this.params = {
			...requiredParams.Defaults,
			...this.apiVersion,
		}

		return this.params

	}

	signString(urlParams, api, apiVersion, secretAccessKey) {

		try {

			let HTTPRequestURI = '/'

			if (api !== 'Reports') HTTPRequestURI = `/${api}/${apiVersion}`

			this.stringSignValues = {
				HTTPVerb: 'POST',
				ValueOfHostHeaderInLowercase: 'mws.amazonservices.com',
				HTTPRequestURI,
				CanonicalizedQueryString: urlParams,
			}

			this.stringToSign = Object.values(this.stringSignValues)
				.reduce((string, value) => `${string}\n${value}`)

			this.signature = crypto.createHmac('sha256', secretAccessKey)
				.update(this.stringToSign, 'utf8')
				.digest('base64')

		} catch (e) {

			console.log(`Error on signString: ${e}`)

		}

		return this.signature

	}

}

module.exports = Core
