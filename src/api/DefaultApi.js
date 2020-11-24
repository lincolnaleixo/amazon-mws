const xml2js = require('xml2js')
const csvtojson = require('csvtojson')
// const contentBoilerPlates = { _POST_PRODUCT_PRICING_DATA_: 'price_boilerplate.xml' }
const xmlParser = new xml2js.Parser({
	mergeAttrs: true,
	explicitArray: false,
	emptyTag: {},
	charkey: 'Value',
})
const axios = require('axios').default
const Cawer = require('cawer')
const qs = require('qs')
const moment = require('moment')
const crypto = require('crypto')
const urljoin = require('url-join')
const endpoints = require('../resources/endpoints')
const errorHandler = require('../helper/ErrorHandling')
const apiReference = require('../resources/apiReference')
const cawer = new Cawer()

// TODO jsdoc de tudo
// TODO headers agent e padrao pegando de api reference

class DefaultApi {

	constructor(credentials, marketplace, api) {
		this.credentials = credentials
		this.marketplace = endpoints[marketplace]
		this.api = api
		this.moment = moment
	}

	async formatResponseText(responseText) {
		let formattedResponseText = []

		if (cawer.isXml(responseText)) {
			formattedResponseText = await xmlParser.parseStringPromise(responseText)
		} else {
			formattedResponseText = await csvtojson({
				delimiter: '\t',
				ut: 'json',
			})
				.fromString(responseText)
		}

		return formattedResponseText
	}

	getActionName() {
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[2].split('.')[1].split('(')[0].trim()

		return fnName[0].toUpperCase() + fnName.slice(1)
	}

	getStringSignature(params) {
		const paramsToSign = qs.stringify(params)
		const endpointDomain = this.marketplace.url.replace('https://', '')

		let stringToSign = `${apiReference.Defaults.HTTPMethod}\n`
		stringToSign += `${endpointDomain}\n`
		stringToSign += `/${this.api !== 'Reports' ? `${this.api}/${apiReference[this.api].Version}` : ''}\n`
		stringToSign += `${paramsToSign}`

		return crypto.createHmac('sha256', this.credentials.MWS_SECRET_ACCESS_KEY)
			.update(stringToSign, 'utf8')
			.digest('base64')
	}

	sortParameters(params) {
		const paramsSorted = {}
		Object.keys(params)
			.sort()
			.forEach((key) => {
				paramsSorted[key] = params[key]
			})

		return paramsSorted
	}

	getParams(options) {
		const params = {
			...apiReference.Defaults.RequestParams,
			...this.getRequiredParams(options),
			...options.Params,
		}

		return this.sortParameters(params)
	}

	getRequiredParams(options) {
		const requiredParams = {
			Action: options.Action,
			SellerId: this.credentials.MWS_SELLER_ID,
			AWSAccessKeyId: this.credentials.MWS_AWS_ACCESS_KEY_ID,
			Version: apiReference[this.api].Version,
			Timestamp: moment().toISOString(),
		}
		if (apiReference.MarketplaceListActions.find((item) => item === options.Action) === undefined) {
			requiredParams.MarketplaceId = this.marketplace.id
		}

		return requiredParams
	}

	getUrl(isSpecialRequest, params) {
		const isApiReports = this.api === 'Reports'

		return urljoin(this.marketplace.url,
			isApiReports ? '' : urljoin(this.api, apiReference[this.api].Version),
			isSpecialRequest ? '' : `?${qs.stringify(params)}`)
	}

	getRequestConfig(options, params) {
		const isSpecialRequest = apiReference.SpecialRequests
			.find((item) => item === options.Action) !== undefined
		const requestConfig = {
			url: this.getUrl(isSpecialRequest, params),
			method: apiReference.Defaults.HTTPMethod,
			data: isSpecialRequest ? new URLSearchParams(params) : options.Data || '',
		}

		if (options.Action === 'SubmitFeed') requestConfig.headers = options.Headers

		return requestConfig
	}

	async request(options) {
		let throttleSleepTime = 1
		while (true) {
			throttleSleepTime *= 2
			const params = this.getParams(options)
			params.Signature = this.getStringSignature(params)

			const requestConfig = this.getRequestConfig(options, params)

			try {
				const response = await axios.request(requestConfig)

				return await this.formatResponseText(response.data.toString('latin1'))
			} catch (err) {
				if (err.response) {
					if (await errorHandler.handleRequestError(err, throttleSleepTime)) continue
					else throw new Error(`${err.response.status}:${err.response.statusText}\n${err.response.data.toString()}`)
				}
				throw new Error(err)
			}
		}
	}

}

module.exports = DefaultApi
