/* eslint-disable no-unused-vars */
/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../lib/logger')
const Finances = require('../src/finances.js')

const options = jsonfile.readFileSync('./options.json')
// eslint-disable-next-line complexity
const feature = 'finances'

async function getCredentials() {

	const type = 'gsheets'

	const configurati = new Configurati(type, options)

	const config = await configurati.get()

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	return credentials

}

async function listFinancialEvents() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`
	const credentials = await getCredentials()

	const finances = new Finances(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const { orderId } = options
		const response = await finances.listFinancialEvents(orderId)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function testAllFunctions() {

	await listFinancialEvents()

}

(async () => {

	await testAllFunctions()

})()
