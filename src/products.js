/* eslint-disable max-lines-per-function */
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const Core = require('./core')
// TODO jsdoc de todos os metodos

class Products {

	constructor(credentials) {

		this.core = new Core()
		this.api = 'Products'
		this.credentials = credentials
		this.endpoint = 'https://mws.amazonservices.com/'
		this.headers = { 'Content-Type': 'text/xml' }

	}

	async getMatchingProduct(marketplaceId, asin) {

		let jsonResponse = {}

		const action = 'GetMatchingProduct'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = {
			MarketplaceId: marketplaceId,
			'ASINList.ASIN.1': asin,
		}

		const paramEntries = Object.entries({
			...requiredParams, ...params,
		})

		const urlParams = new URLSearchParams(paramEntries)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}${this.api}/${requiredParams.Version}?${urlParams}`

		const response = await fetch(url, {
			method: 'POST',
			headers: this.headers,
		})

		const xml = await response.text()
		const xmlParser = new xml2js.Parser({
			mergeAttrs: true,
			explicitArray: false,
			emptyTag: {},
			charkey: 'Value',
		})
		jsonResponse = await xmlParser.parseStringPromise(xml /* , options */)

		const matchingProduct = jsonResponse.GetMatchingProductResponse.GetMatchingProductResult
		// console.log(JSON.stringify(matchingProduct, null, 2))

		// if (jsonResponse.ErrorResponse && jsonResponse.ErrorResponse.Error.Code === 'InvalidReportType') {

		// 	throw new Error(jsonResponse.ErrorResponse.Error.Message)

		// }

		return matchingProduct

	}

}

module.exports = Products
