/* eslint-disable import/no-dynamic-require */
/* eslint-disable require-jsdoc */
/* eslint-disable global-require */
const Products = require('./products.js')

class Main {

	constructor(credentials) {
		return { Products: new Products(credentials) }
	}
}

module.exports = Main
