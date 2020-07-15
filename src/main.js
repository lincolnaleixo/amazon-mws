const Reports = require('./reports.js')

class Main {

	constructor(credentials) {
		return { Reports: new Reports(credentials) }
	}
}

module.exports = Main
