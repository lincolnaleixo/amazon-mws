/* eslint-disable max-lines-per-function */
const fetch = require('node-fetch')
const xml2js = require('xml2js')
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

		// TODO mudar para ASINLIST

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

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

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getCompetitivePricingForASIN(marketplaceId, asin) {

		// TODO mudar para ASINLIST
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

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

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getLowestOfferListingsForASIN(marketplaceId, asin) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

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

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getLowestPricedOffersForASIN(marketplaceId, asin, itemCondition) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = {
			MarketplaceId: marketplaceId,
			ASIN: asin,
			ItemCondition: itemCondition,
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

		// TODO ver uma forma de passar esse metodo para o core. Esse é unico que precisa passar os parametros via post data

		// const url = `${this.endpoint}${this.api}/${requiredParams.Version}?${urlParams}`

		// const response = await this.core.requestMws(url, this.headers)

		const url = `${this.endpoint}${this.api}/${requiredParams.Version}`

		const response = await fetch(url, {
			method: 'POST',
			body: urlParams,
		})

		const responseText = await response.text()
		const xmlParser = new xml2js.Parser({
			mergeAttrs: true,
			explicitArray: false,
			emptyTag: {},
			charkey: 'Value',
		})

		const jsonResponse = await xmlParser.parseStringPromise(responseText)

		return jsonResponse[attrName]

	}

	async getMyPriceForASIN(marketplaceId, asin) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

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

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getProductCategoriesForASIN(marketplaceId, asin) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = {
			MarketplaceId: marketplaceId,
			ASIN: asin,
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

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

}

module.exports = Products
