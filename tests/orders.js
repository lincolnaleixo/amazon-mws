/* eslint-disable no-unused-vars */
/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../lib/logger')
const Orders = require('../src/orders.js')

const options = jsonfile.readFileSync('./options.json')
// eslint-disable-next-line complexity
const feature = 'orders'

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

async function listOrders() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const startDate = options.ordersStartDate
	const endDate = options.ordersEndDate

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`
	const credentials = await getCredentials()

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await orders.listOrders(startDate, endDate)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function listOrdersByNextToken() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`
	const credentials = await getCredentials()

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const listOrdersNextToken = options.listOrdersToken
		const response = await orders.listOrdersByNextToken(listOrdersNextToken)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function getOrder() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`
	const credentials = await getCredentials()

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const { orderId } = options
		const response = await orders.getOrder(orderId)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function listOrderItems() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`
	const credentials = await getCredentials()

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const { orderId } = options
		const response = await orders.listOrderItems(orderId)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function listOrderItemsByNextToken() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`
	const credentials = await getCredentials()

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const { listOrdersItemsNextToken } = options
		const response = await orders.listOrderItemsByNextToken(listOrdersItemsNextToken)
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

	const orders = new Orders(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await orders.getServiceStatus()
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function testAllFunctions() {

	await listOrders()
	await listOrdersByNextToken()
	await getOrder()
	await listOrderItems()
	// await listOrderItemsByNextToken() // can't test it because couldn't find listorderitems nextToken
	await getServiceStatus()

}

(async () => {

	await testAllFunctions()

})()
