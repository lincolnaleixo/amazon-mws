/* eslint-disable no-unused-vars */
/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../lib/logger')
const Products = require('../src/products.js')

const options = jsonfile.readFileSync('./options.json')

const feature = 'products'

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

async function getMatchingProduct() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	const { asin } = options

	try {

		const response = await products.getMatchingProduct(credentials.marketplaceId, asin)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

}

async function getCompetitivePricingForASIN() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	const { asin } = options

	try {

		const response = await products.getCompetitivePricingForASIN(credentials.marketplaceId, asin)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

}

async function getLowestOfferListingsForASIN() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	const { asin } = options

	try {

		const response = await products.getLowestOfferListingsForASIN(credentials.marketplaceId, asin)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

}

async function getLowestPricedOffersForASIN() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	const { marketplaceId } = credentials
	const {
		asin, itemCondition,
	} = options

	try {

		const response = await products.getLowestPricedOffersForASIN(marketplaceId, asin, itemCondition)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

}

async function getMyPriceForASIN() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	const { marketplaceId } = credentials
	const {
		asin, itemCondition,
	} = options

	try {

		const response = await products.getMyPriceForASIN(marketplaceId, asin, itemCondition)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

}

async function getProductCategoriesForASIN() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const products = new Products(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	const { marketplaceId } = credentials
	const {
		asin, itemCondition,
	} = options

	try {

		const response = await products.getProductCategoriesForASIN(marketplaceId, asin, itemCondition)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], 2))

		// console.log(JSON.stringify(response, null, 2))

	} catch (err) {

		this.logger.info(err.stack)

		// fs.writeFileSync(`${dumpFolder}/${dumpFile}.json`, err.message)

	}

}

async function testAllFunctions() {

	await getMatchingProduct()
	await getCompetitivePricingForASIN()
	await getLowestOfferListingsForASIN()
	await getLowestPricedOffersForASIN()
	await getMyPriceForASIN()
	await getProductCategoriesForASIN()

}

(async () => {

	await testAllFunctions()

})()
