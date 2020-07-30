const Reports = require('./reports.js')
const Orders = require('./orders.js')

class Main {

	/**
     * @param {object} credentials
     */
	constructor(credentials) {
		return {
			Reports: new Reports(credentials, 'Reports'),
			Orders: new Orders(credentials, 'Orders'),
		}
	}
}

module.exports = Main
