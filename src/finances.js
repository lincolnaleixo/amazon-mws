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

		const params = { AmazonOrderId: amazonOrderId }

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

	async listFinancialEventsByNextToken(nextToken) {

		// TODO add all parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { NextToken: nextToken }

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

	async listFinancialEventGroups(startDate) {

		// TODO add all parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { FinancialEventGroupStartedAfter: startDate }

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

	async listFinancialEventGroupsByNextToken(nextToken) {

		// TODO add all parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { NextToken: nextToken }

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

	async getServiceStatus() {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

}

module.exports = Finances
