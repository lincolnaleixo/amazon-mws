/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const fs = require('fs')
const Logger = require('../lib/logger')
const Products = require('../src/products.js')
const options = require('../options.json');

// eslint-disable-next-line complexity
(async () => {

	const feature = 'products'

	const logger = new Logger(feature)
	this.logger = logger.get()

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`
	const dumpFile = 'getMatchingProduct.json'
	const { asin } = options

	try {

		const response = await products.getMatchingProduct(credentials.marketplaceId, asin)
		fs.writeFileSync(`${dumpFolder}/${dumpFile}`, JSON.stringify(response, null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

})()
