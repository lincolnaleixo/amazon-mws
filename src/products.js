const Core = require('./core')
const apiResources = require('../resources/apiOperations.js')

/**
 * Products API class
 */
class Products extends Core {

	/**
	 * Set credentials
	 * @param {Object} credentials
	 */
	constructor(credentials) {
		const className = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('new')[1].split('(')[0].trim()
		super(className, credentials)
	}

	/**
	 * Request Amazon MWS based on action and params
	 * @param {string} action Action to request. One of http://docs.developer.amazonservices.com/en_US/products/Products_Overview.html
	 * @param {Object} params
	 */
	request(action, params) {
		if (!super.isOperationValid(action)) throw new Error(`Action ${action} does not exist on Amazon MWS or not supported`)

		// if (!super.areTypesValid(params)) throw new Error(`Action ${action} does not exist on Amazon MWS or not supported`)
		// const formattedParams = super.formatParams(params)

		return super.startRequest(action, params)
	}

}

module.exports = Products
