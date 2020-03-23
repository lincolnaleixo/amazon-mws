/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const fs = require('fs')
const Logger = require('../lib/logger')
const Orders = require('../src/orders.js')
const options = require('../options.json');

// eslint-disable-next-line complexity
(async () => {

	const feature = 'orders'

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

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await orders.listOrders()
		fs.writeFileSync(`${dumpFolder}/${feature}.json`, JSON.stringify(response, null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)
		if (err.message.indexOf('Invalid Report Type') > -1) {

			fs.writeFileSync(`${dumpFolder}/${feature}.json`, err.message)

		}

	}

})()
