/* eslint-disable max-lines-per-function */
const Core = require('./core')
// TODO jsdoc de todos os metodos

class Orders {

	constructor(credentials) {

		this.core = new Core()
		this.api = 'Orders'
		this.credentials = credentials
		this.endpoint = 'https://mws.amazonservices.com/'
		this.headers = { 'Content-Type': 'text/xml' }

	}

	async listOrders(startDate, endDate) {

		// TODO add other parameters options
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = { 'MarketplaceId.Id.1': this.credentials.marketplaceId }

		if (startDate) params.CreatedAfter = startDate
		if (endDate) params.CreatedBefore = endDate

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

	async listOrdersByNextToken(nextToken) {

		// TODO add other parameters options
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = { NextToken: nextToken }

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

	async getOrder(amazonOrderId) {

		// TODO colocar amazonorderid as list
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = { 'AmazonOrderId.Id.1': amazonOrderId }

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

	async listOrderItems(amazonOrderId) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = { AmazonOrderId: amazonOrderId }

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

	async listOrderItemsByNextToken(nextToken) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = { NextToken: nextToken }

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

	async getServiceStatus() {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		// const paramEntries = Object.entries({ ...requiredParams })

		const urlParams = new URLSearchParams(requiredParams)
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

module.exports = Orders
