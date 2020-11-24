/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
const qs = require('qs')
const httpAction = 'POST'
const crypto = require('crypto')
const xml2js = require('xml2js')
const fs = require('fs-extra')
const csvtojson = require('csvtojson')
const path = require('path')
const contentBoilerPlates = { _POST_PRODUCT_PRICING_DATA_: 'price_boilerplate.xml' }
// @ts-ignore
const Cawer = require('cawer')
const cawer = new Cawer()
const xmlParser = new xml2js.Parser({
	mergeAttrs: true,
	explicitArray: false,
	emptyTag: {},
	charkey: 'Value',
})
const urljoin = require('url-join')
const moment = require('moment')
const axios = require('axios').default
const domainName = 'https://mws.amazonservices.com/'
const apiVersions = require('../archive/resources/apiVersions')

class Core {

	/**
	 * @param {object} credentials
	 */
	constructor(credentials) {
		this.credentials = credentials
	}

	sortParameters(requestParams) {
		const requestParamsEntriesSorted = {}
		Object.keys(requestParams)
			.sort()
			.forEach((key) => {
				requestParamsEntriesSorted[key] = requestParams[key]
			})

		// console.log('Parameters entries sorted:\n')
		// console.log(requestParamsEntriesSorted)

		return requestParamsEntriesSorted
	}

	signString(requestParams) {
	// delete requestParams.Signature
		const paramsToSign = qs.stringify(requestParams)
		// console.log('ParamsToSign:\n')
		// console.log(paramsToSign)
		let stringToSign = `${httpAction}\n`
		stringToSign += `mws.amazonservices.com\n`
		if (this.api !== 'Reports') {
			stringToSign += `/${this.api}/${apiVersions[this.api]}\n`
		} else {
			stringToSign += '/\n'
		}
		stringToSign += `${paramsToSign}`
		// console.log('\nStringToSign:\n')
		// console.log(stringToSign)
		const signature = crypto.createHmac('sha256', this.credentials.MWS_SECRET_ACCESS_KEY)
			.update(stringToSign, 'utf8')
			.digest('base64')

		// console.log('\nSignature:\n')
		// console.log(signature)

		// console.log('\nParameters with signature:\n')
		// console.log(requestParams)

		return signature
	}

	/**
	 * @param {import("xml2js").convertableToString} responseText
	 */
	async formatResponseText(responseText) {
		let formattedResponseText = []

		if (cawer.isXml(responseText)) {
			formattedResponseText = await xmlParser.parseStringPromise(responseText)

			// return this.JSONstringify(formattedResponseText)
			// return JSON.stringify(formattedResponseText, null, 2)
		} else {
			formattedResponseText = await csvtojson({
				delimiter: '\t',
				// @ts-ignore
				ut: 'json',
			})
			// @ts-ignore
				.fromString(responseText)
		}

		return formattedResponseText
	}

	/**
	 * @param {number} throttleSleepTime
	 */
	throttleRequest(throttleSleepTime) {
		console.log(`Request is throttled, sleeping for ${throttleSleepTime} seconds and trying again`)
		cawer.sleep(throttleSleepTime)
	}

	prepareUrl(options) {
		this.requiredParams = {
			AWSAccessKeyId: this.credentials.MWS_AWS_ACCESS_KEY_ID,
			Action: '',
			// MWSAuthToken: '',
			SellerId: this.credentials.MWS_SELLER_ID,
			// Signature: '',
			SignatureMethod: 'HmacSHA256',
			SignatureVersion: '2',
			Timestamp: moment().toISOString(),
			Version: apiVersions[this.api],
		}
		this.requiredParams.Action = options.Action
		const params = {
			...this.requiredParams, ...options.Params,
		}
		const requestParamsEntriesSorted = this.sortParameters(params)
		requestParamsEntriesSorted.Signature = this.signString(requestParamsEntriesSorted)

		if (this.api !== 'Reports') {
			return urljoin(domainName, this.api, apiVersions[this.api], `?${qs.stringify(requestParamsEntriesSorted)}`)
		}

		return urljoin(domainName, `?${qs.stringify(requestParamsEntriesSorted)}`)
	}

	async request(options) {
		this.api = options.Api
		let throttleSleepTime = 1

		while (true) {
			throttleSleepTime *= 2
			const url = this.prepareUrl(options)
			try {
				const requestItems = {
					headers: {
						...{ 'User-Agent': 'amz-mws-api' },
						...options.Headers,
					},
					method: httpAction,
					url,
					responseType: 'arraybuffer',
					responseEncoding: 'binary',
				}

				if (this.api === 'Feeds') {
					const contentBoilerPlate = fs
						.readFileSync(path.join(__dirname, `../resources/feeds/${contentBoilerPlates[options.Params.FeedType]}`)).toString()
					const body = contentBoilerPlate
						.replace('$$SellerId$$', options.Params.SellerId)
						.replace('$$SKU$$', options.Params.SKU)
						.replace('$$StandardPrice$$', options.Params.StandardPrice)
						.replace('$$SalePrice$$', options.Params.SalePrice)
						.replace('$$SaleStartDate$$', options.Params.SaleStartDate)
						.replace('$$SaleEndDate$$', options.Params.SaleEndDate)
					requestItems.data = body
					const contentHash = crypto.createHash('md5').update(body)
						.digest('base64')
					requestItems.ContentMD5Value = contentHash
					requestItems.headers['Content-MD5'] = contentHash
				}

				// @ts-ignore
				const response = await axios.request(requestItems)

				return await this.formatResponseText(response.data.toString('latin1'))
			} catch (err) {
				if (err.response) {
					if (err.response.status === 503) {
						console.log(`Error 503: Request is throttled, sleeping for ${throttleSleepTime} seconds and trying again`)
						cawer.sleep(throttleSleepTime); continue
					} else if (err.Error && err.Error.message === 'socket hang up') {
						console.log(`Socket hanged up, trying again in ${throttleSleepTime} seconds`)
						cawer.sleep(throttleSleepTime); continue
					}
					throw new Error(err.response)
				}
				throw new Error(err)
			}
		}
	}

}

module.exports = Core
