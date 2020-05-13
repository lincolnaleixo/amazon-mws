/* eslint-disable require-jsdoc */
const Configurati = require('configurati')
const testOptions = require('./options')
// const Logger = require('../lib/logger')

class Helper {

	constructor() {
		this.type = 'gsheets'
		this.configurati = new Configurati(this.type, testOptions)
	}

	async get(filename) {
		const configurati = await this.configurati.get()
		// const credentials = {
		// 	accessKeyId: config.credentials.ACCESS_KEY_ID,
		// 	sellerId: config.credentials.SELLER_ID,
		// 	secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		// 	marketplaceId: config.credentials.MARKETPLACE_ID,
		// }
		const feature = filename[0].toUpperCase() + filename.slice(1)
		const featureFolder = feature.toLowerCase()
		// const logger = new Logger(feature)
		// const loggerr = logger.get()
		const dumpPath = `${testOptions.dumpFolder}/${featureFolder}`

		return {
			configurati,
			feature,
			featureFolder,
			dumpPath,
		}
	}

}

module.exports = Helper
