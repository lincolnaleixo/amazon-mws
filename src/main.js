const Reports = require('./reports.js')
const Orders = require('./orders.js')
const Feeds = require('./feeds.js')

class Main {

	/**
     * @param {object} credentials
     */
	constructor(credentials) {
		return {
			Reports: new Reports(credentials, 'Reports'),
			Orders: new Orders(credentials, 'Orders'),
			Feeds: new Feeds(credentials, 'Feeds'),
		}
	}
}
// TODO ver se da para exports o object direto e dai consegue ter intelissense
module.exports = Main
