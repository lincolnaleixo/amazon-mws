/* eslint-disable complexity */
const crypto = require('crypto')
const moment = require('moment')
const fetch = require('node-fetch')
const xml2js = require('xml2js')
const Cawer = require('cawer')
const csvtojson = require('csvtojson')
const urljoin = require('url-join')
const requiredParams = require('../resources/requiredParams.json')
const defaults = require('../resources/defaults.json')
const Logger = require('../lib/logger')

class Core {

	constructor() {

		this.feature = 'core'
		this.cawer = new Cawer()

		this.logger = new Logger(this.feature)
		this.logger = this.logger.get()
		this.endpoint = 'https://mws.amazonservices.com/'

		this.xmlParser = new xml2js.Parser({
			mergeAttrs: true,
			explicitArray: false,
			emptyTag: {},
			charkey: 'Value',
		})

	}

	prepareRequiredParams(requestInfo) {

		const preparedRequiredParams = requiredParams

		preparedRequiredParams.Defaults.Timestamp = moment()
			.toISOString()

		preparedRequiredParams.Defaults.AWSAccessKeyId = requestInfo.credentials.accessKeyId
		preparedRequiredParams.Defaults.SellerId = requestInfo.credentials.sellerId
		preparedRequiredParams.Defaults.Action = requestInfo.action
		preparedRequiredParams.Defaults.ApiVersion = requiredParams[requestInfo.api].version

		return preparedRequiredParams.Defaults

	}

	async handleResponseErrors(url, requestInfo, backOffTimer) {

		const errorMessage = this.response.ErrorResponse.Error.Message

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
			const sleepSeconds = (parseInt(minutes, 10)) * 60 + 10

			this.logger.error(`${errorMessage} (${this.response.status}).`)
			this.logger.warn(`Will try again in ${sleepSeconds} seconds`)

			await this.cawer.sleep(sleepSeconds)

			return this.requestMws(url, headers, 1)

		}

		if (errorMessage.indexOf('Invalid Report Type') > -1) {

			this.logger.error(errorMessage)

			return { error: 'Invalid Report Type' }

		}

		this.logger.error(`${errorMessage}${this.response.status ? ` (${this.response.status})` : ''}. Trying again in ${backOffTimer} seconds`)

		await this.cawer.sleep(backOffTimer)

		return this.requestMws(requestInfo, backOffTimer * 2)

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

			this.logger.error(`Error on signString: ${e}`)

		}

		return this.signature

	}

	async cleanResponse() {

		if (this.cawer.isXml(this.responseText)) {

			this.response = await this.xmlParser.parseStringPromise(this.responseText)
			// if (this.response.ErrorResponse.Error.Message.indexOf('Report 126 creation request for merchant') > -1) {

			// 	this.response = {}
			// 	this.response.RequestReportResponse = this.response.ErrorResponse.Error.Message

			// }

		} else {

			this.response = await csvtojson({
				delimiter: '\t',
				ut: 'json',
			})
				.fromString(this.responseText)

		}

	}

	isSpecialRequest(action) {

		// Requests that need to pass the params in the body of the request
		return defaults.specialRequests.find((item) => item === action) !== undefined

	}

	async requestMws(requestInfo, backOffTimer = 2) {

		// try {

		const { secretAccessKey } = requestInfo.credentials
		const isSpecialRequest = this.isSpecialRequest(requestInfo.action)

		const preparedRequiredParams = this.prepareRequiredParams(requestInfo)
		const paramEntries = Object.entries({
			...preparedRequiredParams, ...requestInfo.params,
		})
		const urlParams = new URLSearchParams(paramEntries)
		urlParams.sort()

		const signature = this.signString(urlParams, requestInfo.api,
			preparedRequiredParams.ApiVersion, secretAccessKey)
		urlParams.append('Signature', signature)

		const url = urljoin(this.endpoint, requestInfo.api !== 'Reports' ? requestInfo.api : '/', requestInfo.api !== 'Reports' ? preparedRequiredParams.ApiVersion : '', isSpecialRequest ? '' : `?${urlParams}`)

		this.response = await fetch(url, {
			method: 'POST',
			body: isSpecialRequest && urlParams,
			headers: !isSpecialRequest && requestInfo.headers,
		})

		this.responseText = await this.response.text()
		await this.cleanResponse()
		if (this.response.ErrorResponse) await this.handleResponseErrors(url, requestInfo, backOffTimer)

		// } catch (err) {

		// 	this.logger.error('Error on core.requestMws')
		// 	throw new Error(JSON.stringify(this.responseText, null, 0))

		// }

		return this.response

	}

}

module.exports = Core
