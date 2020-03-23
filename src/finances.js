/* eslint-disable max-lines-per-function */
const Core = require('./core')
// TODO jsdoc de todos os metodos

class Finances {

	constructor(credentials) {

		this.core = new Core()
		// TODO ver como pegar nome de class
		this.api = 'Finances'
		this.credentials = credentials
		this.endpoint = 'https://mws.amazonservices.com/'
		this.headers = { 'Content-Type': 'text/xml' }

	}

	async listFinancialEvents(amazonOrderId) {

		// TODO add all parameters
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

}

module.exports = Finances
