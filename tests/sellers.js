/* eslint-disable no-unused-vars */
/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const fs = require('fs')
const jsonfile = require('jsonfile')
const path = require('path')
const Logger = require('../lib/logger')
const Sellers = require('../src/sellers.js')

const filename = path.basename(__filename)
const feature = filename.replace('.js', '')

const options = jsonfile.readFileSync('./options.json')

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

async function listMarketplaceParticipations() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const sellers = new Sellers(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await sellers[fnName](credentials.marketplaceId)
		if (!fs.existsSync(dumpFolder)) fs.mkdirSync(dumpFolder)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function getServiceStatus() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const sellers = new Sellers(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await sellers[fnName]()
		if (!fs.existsSync(dumpFolder)) fs.mkdirSync(dumpFolder)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function testAllFunctions() {

	await listMarketplaceParticipations()
	await getServiceStatus()

}

(async () => {

	await testAllFunctions()

})()
