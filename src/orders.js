/* eslint-disable max-lines-per-function */
const xml2js = require('xml2js')
const fetch = require('node-fetch')
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

		let jsonResponse = {}

		const action = 'ListOrders'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		const params = {
			CreatedAfter: '2020-03-11T23:00:00',
			CreatedBefore: '2020-03-17T23:00:00',
			'MarketplaceId.Id.1': this.credentials.marketplaceId,
		}

		if (startDate) params.StartDate = startDate
		if (endDate) params.EndDate = endDate

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

		const orders = jsonResponse.ListOrdersResponse.ListOrdersResult.Orders.Order
		// console.log(JSON.stringify(orders, null, 2))

		if (jsonResponse.ErrorResponse && jsonResponse.ErrorResponse.Error.Code === 'InvalidReportType') {

			throw new Error(jsonResponse.ErrorResponse.Error.Message)

		}

		return orders

	}

}

module.exports = Orders
