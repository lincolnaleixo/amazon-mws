const Reports = require('./reports.js')

class Main {

	/**
     * @param {object} credentials
     */
	constructor(credentials) {
		return { Reports: new Reports(credentials) }
	}
}

module.exports = Main
