const Core = require('./core')
const Logger = require('../lib/logger')
const requiredParams = require('../resources/requiredParams.json')

class Sellers {

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

	async listMarketplaceParticipations(marketplaceId) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { MarketplaceId: marketplaceId }

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

module.exports = Sellers
