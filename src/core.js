/* eslint-disable max-lines-per-function */
const crypto = require('crypto')
const moment = require('moment')
const fetch = require('node-fetch')
const xml2js = require('xml2js')
const cawer = require('cawer')
const csvtojson = require('csvtojson')
const requiredParams = require('../resources/requiredParams.json')
const Logger = require('../lib/logger')

class Core {

	constructor() {

		this.feature = 'core'

		this.logger = new Logger(this.feature)
		this.logger = this.logger.get()

	}

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

			this.logger.error(`Error on signString: ${e}`)

		}

		return this.signature

	}

	async requestMws(url, headers, backOffTimer = 2) {

		try {

			this.response = await fetch(url, {
				method: 'POST',
				headers,
			})

			this.responseText = await this.response.text()
			const xmlParser = new xml2js.Parser({
				mergeAttrs: true,
				explicitArray: false,
				emptyTag: {},
				charkey: 'Value',
			})

			// if (this.response.status === 400) throw new Error()

			// TODO criar em cawer um xml validator, mudar aqui depois
			try {

				this.jsonResponse = await xmlParser.parseStringPromise(this.responseText)

			} catch (error) {

				this.jsonResponse = await csvtojson({
					delimiter: '\t',
					output: 'json',
				})
					.fromString(this.responseText)

			}

			if (this.jsonResponse.ErrorResponse) {

				const errorMessage = this.jsonResponse.ErrorResponse.Error.Message

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

					await cawer.sleep(sleepSeconds)

					return this.requestMws(url, headers, 1)

				}

				if (errorMessage.indexOf('Invalid Report Type') > -1) {

					this.logger.error(errorMessage)

					return { error: 'Invalid Report Type' }

				}

				this.logger.error(`${errorMessage} (${this.response.status}). Trying again in ${backOffTimer} seconds`)

				await cawer.sleep(backOffTimer)

				return this.requestMws(url, headers, backOffTimer * 2)

			}

		} catch (err) {

			throw new Error(JSON.stringify(this.responseText, null, 0))

		}

		return this.jsonResponse

	}

}

module.exports = Core
