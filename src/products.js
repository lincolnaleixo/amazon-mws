const Core = require('./core')
const Logger = require('../lib/logger')
const requiredParams = require('../resources/requiredParams.json')

// TODO jsdoc de todos os metodos

class Products {

	constructor(credentials) {

		const className = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('new')[1].split('(')[0].trim()
		this.api = className

		this.core = new Core()
		this.logger = new Logger(this.api)

		this.credentials = credentials
		this.headers = requiredParams[this.api].headers

	}

	async getMatchingProduct(marketplaceId, asin) {

		// TODO mudar para ASINLIST

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			'ASINList.ASIN.1': asin,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getCompetitivePricingForASIN(marketplaceId, asin) {

		// TODO mudar para ASINLIST
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			'ASINList.ASIN.1': asin,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getCompetitivePricingForSKU(marketplaceId, sku) {

		// TODO mudar para SKULIST
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			'SellerSKUList.SellerSKU.1': sku,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getLowestOfferListingsForASIN(marketplaceId, asin) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			'ASINList.ASIN.1': asin,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getLowestOfferListingsForSKU(marketplaceId, sku) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			'SellerSKUList.SellerSKU.1': sku,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getLowestPricedOffersForASIN(marketplaceId, asin, itemCondition) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			ASIN: asin,
			ItemCondition: itemCondition,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getLowestPricedOffersForSKU(marketplaceId, sku, itemCondition) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			SellerSKU: sku,
			ItemCondition: itemCondition,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getMyPriceForASIN(marketplaceId, asin) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			'ASINList.ASIN.1': asin,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getProductCategoriesForASIN(marketplaceId, asin) {

		// TODO adicionar todos os parametros
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = {
			MarketplaceId: marketplaceId,
			ASIN: asin,
		}

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

}

module.exports = Products
