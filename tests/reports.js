/* eslint-disable no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const Cawer = require('cawer')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../lib/logger')
const Reports = require('../src/reports.js')

const options = jsonfile.readFileSync('./options.json')
const reportTypes = require('../resources/reportTypes.json')

let feature = 'reports'

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

async function getReportRequestListByNextToken() {

	feature = 'getReportRequestListByNextToken'

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()
	const dumpFolder = `${options.dumpFolder}/`

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	let response = ''
	const reports = new Reports(credentials)
	const nextToken = options.getReportRequestListToken
	response = await reports.getReportRequestListByNextToken(nextToken)

	response = response.GetReportRequestListByNextTokenResult
	fs.writeFileSync(`${dumpFolder}/reports/${feature}.json`, JSON.stringify(response, null, 2))

}

async function getReportRequestCount() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const reports = new Reports(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await reports[fnName]()
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function getReportList(handleNextTokens = false) {

	feature = 'getReportList'

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()
	const dumpFolder = `${options.dumpFolder}/`

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	let response = ''
	const reports = new Reports(credentials)

	response = await reports.getReportList(handleNextTokens)

	response = response.GetReportListResult
	fs.writeFileSync(`${dumpFolder}/reports/${feature}.json`, JSON.stringify(response, null, 2))

}

async function getReportListByNextToken() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const reports = new Reports(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		const response = await reports[fnName](options.getReportListNextToken)
		fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function getReportCount() {

	const dumpFile = 'getReportCount'

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()
	const dumpFolder = `${options.dumpFolder}/`

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	let response = ''
	const reports = new Reports(credentials)

	response = await reports.getReportCount()

	feature = `${dumpFile[0].toUpperCase() + dumpFile.slice(1)}Result`
	response = response[feature]
	fs.writeFileSync(`${dumpFolder}/reports/${dumpFile}.json`, JSON.stringify(response, null, 2))

}

async function getReportScheduleList() {

	// TODO se o metodo de pegar o nome da function funcionar, tambem mudar em todos os testes
	const dumpFile = 'getReportScheduleList'

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()
	const dumpFolder = `${options.dumpFolder}/`

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	let response = ''
	const reports = new Reports(credentials)

	response = await reports.getReportScheduleList()

	feature = `${dumpFile[0].toUpperCase() + dumpFile.slice(1)}Result`
	response = response[feature]
	fs.writeFileSync(`${dumpFolder}/reports/${dumpFile}.json`, JSON.stringify(response, null, 2))

}

async function getReportScheduleListByNextToken() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const fnName = ((((new Error().stack.split('at ') || [])[1] || '')
		.match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		.split('.')
		.pop()

	const action = fnName[0].toUpperCase() + fnName.slice(1)
	const attrName = `${action}Result`

	const credentials = await getCredentials()

	const reports = new Reports(credentials)
	const dumpFolder = `${options.dumpFolder}/${feature}`

	try {

		// No next token available to test right now
		// const response = await reports[fnName](options.getReportListNextToken)
		// fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response[attrName], null, 2))

	} catch (err) {

		this.logger.info(err.stack)

	}

}

async function getReportScheduleCount() {

	// TODO se o metodo de pegar o nome da function funcionar, tambem mudar em todos os testes
	const dumpFile = 'getReportScheduleCount'

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()
	const dumpFolder = `${options.dumpFolder}/`

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	let response = ''
	const reports = new Reports(credentials)

	response = await reports.getReportScheduleCount()

	feature = `${dumpFile[0].toUpperCase() + dumpFile.slice(1)}Result`
	response = response[feature]
	fs.writeFileSync(`${dumpFolder}/reports/${dumpFile}.json`, JSON.stringify(response, null, 2))

}

// * custom methods

async function getCustomInventoryReports() {

	const dumpFile = 'customInventoryreports'

	const type = 'gsheets'

	const configurati = new Configurati(type, options)
	const config = await configurati.get()
	const dumpFolder = `${options.dumpFolder}`

	const credentials = {
		accessKeyId: config.credentials.ACCESS_KEY_ID,
		sellerId: config.credentials.SELLER_ID,
		secretAccessKey: config.credentials.SECRET_ACCESS_KEY,
		marketplaceId: config.credentials.MARKETPLACE_ID,
	}

	const reports = new Reports(credentials)
	const response = await reports.getCustomInventoryReports()

	fs.writeFileSync(`${dumpFolder}/reports/custom/${dumpFile}.json`, response)

}

// * bulk testes

async function testReportRequestTypes() {

	this.cawer = new Cawer()

	feature = 'reports'

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

	let response = ''
	const reports = new Reports(credentials)
	for (const reportTypeGroup in reportTypes) {

		let reportsType = reportTypes[reportTypeGroup]

		const dumpFolder = `${options.dumpFolder}/${feature}/${reportTypeGroup}`

		if (!fs.existsSync(dumpFolder)) fs.mkdirSync(dumpFolder)

		fs.readdirSync(dumpFolder)
			.forEach((file) => {

				reportsType = reportsType.filter((item) => item !== file.replace('.json', ''))

			})

		for (const reportType of reportsType) {

			let backOffTimer = 2

			// const startDate = '2020-02-29T00:00:00'
			// const endDate = '2020-02-29T23:00:00'
			this.logger.info(`Requesting report for report type ${reportTypeGroup}:${reportType}`)

			response = await reports.requestReport(reportType)

			if (response.error || response.Error) {

				fs.writeFileSync(`${dumpFolder}/${reportType}.json`, JSON.stringify(response, null, 2))
				continue

			}

			const reportRequestId = response
				.RequestReportResult
				.ReportRequestInfo
				.ReportRequestId

			while (true) {

				response = await reports.getReportRequestList(reportRequestId)
				const processingStatus = await response
					.GetReportRequestListResult
					.ReportRequestInfo
					.ReportProcessingStatus

				if (processingStatus === '_SUBMITTED_' || processingStatus === '_IN_PROGRESS_') {

					this.logger.info('Report not ready')
					await this.cawer.sleep(backOffTimer)
					backOffTimer *= 2
					continue

				}

				if (processingStatus === '_CANCELLED_' || processingStatus === '_DONE_NO_DATA_') {

					this.logger.info('Report cancelled or no data')
					fs.writeFileSync(`${dumpFolder}/${reportType}.json`, `${reportType} cancelled or no data`)
					break

				}

				if (processingStatus === '_DONE_') {

					this.logger.info('Report done')

					const reportId = response
						.GetReportRequestListResult
						.ReportRequestInfo
						.GeneratedReportId

					response = await reports.getReport(reportId)
					fs.writeFileSync(`${dumpFolder}/${reportType}.json`, JSON.stringify(response, null, 2))
					// this.logger.info(JSON.stringify(response, null, 2))
					break

				}

			}

		}

	}

}

async function testReportsApiFunctions() {

	// await getReportScheduleCount()
	// await getReportScheduleList()
	// await getReportScheduleListByNextToken() // No next token available to test right now
	// await getReportCount()
	// await getReportList()
	// await getReportList(true)
	// await getReportListByNextToken()
	// await getReportRequestListByNextToken()
	// await getReportRequestCount()

}

async function testCustomMethods() {

	await getCustomInventoryReports()

}

(async () => {

	console.log('Testing starting')

	process.env.ENVIROMENT =	'DEVELOPMENT'
	process.env.NODE_ENV =	'DEVELOPMENT'
	await testReportRequestTypes()
	// await testReportsApiFunctions()
	// await testCustomMethods()

	console.log('Testing ended')

})()
