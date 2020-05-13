/* eslint-disable import/no-dynamic-require */
/* eslint-disable require-jsdoc */
/* eslint-disable global-require */
class Main {

	constructor(arg, credentials) {
		const ApiPackage = require(`./${arg}`)
		const api = new ApiPackage(credentials)

		return api
	}
}

module.exports = Main
