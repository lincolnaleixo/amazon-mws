/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
/* eslint-disable valid-typeof */
/* eslint-disable complexity */
const crypto = require('crypto')
const moment = require('moment')
const fetch = require('node-fetch')
const xml2js = require('xml2js')
const Cawer = require('cawer')
const csvtojson = require('csvtojson')
const urljoin = require('url-join')
const qs = require('qs')
const Logering = require('logering')
const defaults = require('../resources/defaults.js')
const apiResources = require('../resources/apiOperations')
const ErrorHandler = require('./errorHandler')
const apiTypes = require('../resources/apiTypes')

/**
 * Core class
 */
class Core {

	/**
	 * Core constructor
	 * @param {string} api
	 * @param {Object} credentials
	 */
	constructor(api, credentials) {
		this.api = api
		this.credentials = credentials
		this.cawer = new Cawer()

		this.logger = new Logering(this.api)
		this.logger = this.logger.get()

		this.endpoint = 'https://mws.amazonservices.com/'

		this.xmlParser = new xml2js.Parser({
			mergeAttrs: true,
			explicitArray: false,
			emptyTag: {},
			charkey: 'Value',
		})

		this.errorHandler = new ErrorHandler(this.logger, this.cawer)
	}

	/**
	 * Prepare the required params for request
	 * @param {Object} requestInfo
	 */
	prepareRequiredParams(requestInfo) {
		const preparedRequiredParams = defaults.defaultsParams

		preparedRequiredParams.Timestamp = moment()
			.toISOString()

		preparedRequiredParams.AWSAccessKeyId = requestInfo.credentials.ACCESS_KEY_ID
		preparedRequiredParams.SellerId = requestInfo.credentials.SELLER_ID
		preparedRequiredParams.Action = requestInfo.action
		preparedRequiredParams.Version = apiResources[requestInfo.api].Version

		return preparedRequiredParams
	}

	/**
	 * Sign the string to be used in request
	 * @param {Object} urlParams
	 * @param {string} api
	 * @param {string} apiVersion
	 * @param {string} secretAccessKey
	 */
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

	/**
	 * Sort params alphabetically
	 * @param {Object} params
	 */
	sortParams(params) {
		const paramsEntriesSorted = {}
		Object.keys(params)
			.sort()
			.forEach((key) => {
				paramsEntriesSorted[key] = params[key]
			})

		return paramsEntriesSorted
	}

	/**
	 * Check if parameter requested is valid
	 * @param {string} operationName
	 */
	isOperationValid(operationName) {
		return (apiResources[this.api].Operations
			.map((item) => Object.keys(item)[0])
			.find((operation) => operation === operationName)) !== undefined
	}

	/**
	 * Check if attributes types are valid
	 * @param {[string]} parameters
	 */
	areTypesValid(parameters) {
		// TODO validate if attribute is array of type or not, now is only checking type single
		let attrType
		for (const attribute in parameters) {
			const rawAttribute = attribute.split('.')[0]
			const typeKey = Object.keys(apiTypes)
				.find((attr) => attr === rawAttribute)

			if (typeKey) {
				attrType = Object.prototype.toString.call(parameters[attribute])
					.toLowerCase()
					.split(' ')[1].replace(']', '')
				if (attrType === apiTypes[typeKey].split(':')[0]) {
					if (attrType === 'array') {
						for (let i = 0; i < parameters[attribute].length; i += 1) {
							const item = parameters[attribute][i]
							attrType = Object.prototype.toString.call(item)
								.toLowerCase()
								.split(' ')[1].replace(']', '')
							if (apiTypes[typeKey] !== `array:${attrType}`) {
								this.logger.error(`wrong type for attribute ${apiTypes[typeKey]}`)

								return false
							}
						}
					} else if (attrType === 'object') {
						// @ts-ignore
						for (const paramKey in parameters[attribute]) {
							const paramValue = parameters[attribute][paramKey]
							attrType = Object.prototype.toString.call(paramValue)
								.toLowerCase()
								.split(' ')[1].replace(']', '')
							if (attrType === 'array') {
								for (let i = 0; i < parameters[attribute].length; i += 1) {
									const item = parameters[attribute][i]
									attrType = Object.prototype.toString.call(item)
										.toLowerCase()
										.split(' ')[1].replace(']', '')
									if (apiTypes[typeKey] !== `array:${attrType}`) {
										this.logger.error(`wrong type for attribute ${apiTypes[typeKey]}`)

										return false
									}
								}
							} else if (attrType !== (apiTypes[paramKey] ? apiTypes[paramKey] : apiTypes.customs[apiTypes[rawAttribute].split(':')[1]][paramKey])) {
								this.logger.error(`wrong type for attribute ${apiTypes[typeKey]}`)

								return false
							}
						}
					}
				}
				this.logger.error(`wrong type for attribute ${apiTypes[typeKey]}`)

				return false
			}
			this.logger.error(`No type found for attribute ${attribute}`)

			return false
		}

		return true
	}

	/**
	 * @param {object} params
	 */
	formatParams(params) {
		let formattedParams = {}
		for (const key in params) {
			const paramValue = params[key]
			if (key.indexOf('List') > -1) {
				for (let i = 0; i < paramValue.length; i += 1) {
					const element = paramValue[i]
					const formattedKey = `${key}.${key.replace('List', '')}.${i + 1}`
					const object = {}
					object[formattedKey] = element
					formattedParams = {
						...object, ...formattedParams,
					}
				}
			} else {
				const object = {}
				object[key] = paramValue
				formattedParams = {
					...object, ...formattedParams,
				}
			}
		}

		return formattedParams
	}

	/**
	 * Clean response
	 * @param {string} responseText
	 */
	async formatResponseText(responseText) {
		let formattedResponseText = []

		if (this.cawer.isXml(responseText)) {
			formattedResponseText = await this.xmlParser.parseStringPromise(responseText)
			// if (this.response.ErrorResponse.Error.Message.indexOf('Report 126 creation request for merchant') > -1) {

			// 	this.response = {}
			// 	this.response.RequestReportResponse = this.response.ErrorResponse.Error.Message

			// }
		} else {
			formattedResponseText = await csvtojson({
				delimiter: '\t',
				ut: 'json',
			})
				.fromString(responseText)
		}

		return formattedResponseText
	}

	/**
	 * Check if the request is a special request
	 * Requests that need to pass the params in the body of the request
	 * @param {string} action
	 */
	isSpecialRequest(action) {
		return defaults.specialRequests.find((item) => item === action) !== undefined
	}

	/**
	 * Request from MWS
	 * @param {Object} requestInfo
	 * @param {number} backOffTimer
	 */
	async fetchMWS(requestInfo, backOffTimer = 2) {
		let data
		const isSpecialRequest = this.isSpecialRequest(requestInfo.action)
		const preparedRequiredParams = this.prepareRequiredParams(requestInfo)
		const params = {
			...preparedRequiredParams, ...requestInfo.params,
		}
		const paramsEntriesSorted = this.sortParams(params)
		const paramsToSign = qs.stringify(paramsEntriesSorted)
		const apiVersion = requestInfo.api !== 'Reports' ? params.Version : ''
		const HTTPRequestURI = requestInfo.api !== 'Reports' ? requestInfo.api : '/'
		const signature = this.signString(paramsToSign, HTTPRequestURI,
			params.Version, requestInfo.credentials.SECRET_ACCESS_KEY)

		paramsEntriesSorted.Signature = signature
		const url = urljoin(this.endpoint, HTTPRequestURI, apiVersion, isSpecialRequest ? '' : `?${qs.stringify(paramsEntriesSorted)}`)
		if (isSpecialRequest) {
			data = new URLSearchParams(paramsEntriesSorted)
		}
		// @ts-ignore
		const response = await fetch(url, {
			method: 'POST',
			body: isSpecialRequest ? data : '',
			headers: isSpecialRequest ? '' : requestInfo.headers,
		})
		const responseText = await this.formatResponseText(await response.text())
		const responseStatusCode = response.status || 0
		const responseInfo = {
			responseText, responseStatusCode,
		}
		const isResponseValid = this.errorHandler.isResponseValid(responseInfo, backOffTimer)

		if (isResponseValid === 'retry') return this.fetchMWS(requestInfo, backOffTimer * 2)
		if (isResponseValid === 'ok') return responseText
		throw new Error(JSON.stringify(responseInfo, null, 2))

		// if (this.response.ErrorResponse) await this.handleResponseErrors(url, requestInfo, backOffTimer)
	 }

	/**
	 * Start the request into MWS
	 * @param {string} action
	 * @param {Object} params
	 */
	async startRequest(action, params) {
		const attrName = `${action}Response`
		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: apiResources[this.api].Headers,
			params,
		}
		const response = await this.fetchMWS(requestInfo)

		return response[attrName]
	}

}

module.exports = Core
