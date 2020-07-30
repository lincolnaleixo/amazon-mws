/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
const qs = require('qs')
const httpAction = 'POST'
const crypto = require('crypto')
const xml2js = require('xml2js')
const csvtojson = require('csvtojson')
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
const apiVersions = {
	Reports: '2009-01-01', Orders: '2013-09-01',
}
const domainName = 'https://mws.amazonservices.com/'

class Core {

	/**
	 * @param {object} credentials
	 * @param {string} apiName
	 */
	constructor(credentials, apiName) {
		this.credentials = credentials
		this.requiredParams = {
			AWSAccessKeyId: credentials.AWSAccessKeyId,
			Action: '',
			// MWSAuthToken: '',
			SellerId: credentials.SellerId,
			// Signature: '',
			SignatureMethod: 'HmacSHA256',
			SignatureVersion: '2',
			Timestamp: moment().toISOString(),
			Version: apiVersions[apiName],
		}
	}

	/**
	 * @param {{ [x: string]: any; }} requestParams
	 */
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

	/**
	 * @param {{}} requestParams
	 */
	signString(requestParams, options) {
	// delete requestParams.Signature
		const paramsToSign = qs.stringify(requestParams)
		// console.log('ParamsToSign:\n')
		// console.log(paramsToSign)
		let stringToSign = `${httpAction}\n`
		stringToSign += `mws.amazonservices.com\n`
		if (options.Api !== 'Reports') {
			stringToSign += `/${options.Api}/${apiVersions[options.Api]}\n`
		}
		stringToSign += `${paramsToSign}`
		// console.log('\nStringToSign:\n')
		// console.log(stringToSign)
		const signature = crypto.createHmac('sha256', this.credentials.SecretAccessKey)
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
		} else {
			formattedResponseText = await csvtojson({
				delimiter: '\t',
				// @ts-ignore
				ut: 'json',
			})
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
		this.requiredParams.Action = options.Action
		const params = {
			...this.requiredParams, ...options.ActionParams,
		}
		const requestParamsEntriesSorted = this.sortParameters(params)
		requestParamsEntriesSorted.Signature = this.signString(requestParamsEntriesSorted, options)

		const url = urljoin(domainName, options.Api, apiVersions[options.Api], `?${qs.stringify(requestParamsEntriesSorted)}`)

		return url
	}

	async request(options) {
		let throttleSleepTime = 1
		while (true) {
			throttleSleepTime *= 2
			const url = this.prepareUrl(options)
			try {
				const response = await axios.request({
					method: httpAction,
					url,
					responseType: 'arraybuffer',
					responseEncoding: 'binary',
				})

				return await this.formatResponseText(response.data.toString('latin1'))
			} catch (err) {
				if (err.response !== undefined) {
					if (err.response.status === 503) {
						console.log('Error 503')
						this.throttleRequest(throttleSleepTime); continue
					} else if (err.response.status === 400) {
						console.log('Error 400', JSON.stringify(err, null, 2))
					} else if (err.Error !== undefined && err.Error.message === 'socket hang up') {
						console.log('Socket hanged up, trying again in 30 seconds', JSON.stringify(err, null, 2))
					}
					console.log(JSON.stringify(err, null, 4))
					cawer.sleep(30); continue
				}
				throw new Error(`Not known error, check response:\n${JSON.stringify(err, null, 2)}`)
			}
		}
	}

}

module.exports = Core
