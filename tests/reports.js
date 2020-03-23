/* eslint-disable no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const cawer = require('cawer')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../lib/logger')
const Reports = require('../src/reports.js')

const reportTypes = require('../resources/reportTypes.json')

async function testReportRequestTypes() {

	const options = jsonfile.readFileSync('./options.json')

	const feature = 'reports'

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

		fs.readdirSync(dumpFolder)
			.forEach((file) => {

				reportsType = reportsType.filter((item) => item !== file.replace('.json', ''))

			})

		for (const reportType of reportsType) {

			let backOffTimer = 2

			// const startDate = '2020-02-29T00:00:00'
			// const endDate = '2020-02-29T23:00:00'
			this.logger.info(`Requesting report for report type ${reportType}`)

			response = await reports.requestReport(reportType)

			if (response.error) {

				fs.writeFileSync(`${dumpFolder}/${reportType}.json`, response.error)
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
					await cawer.sleep(backOffTimer)
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

async function getReportRequestListByNextToken() {

	const feature = 'getReportRequestListByNextToken'
	const options = jsonfile.readFileSync('./options.json')

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

async function getReportList() {

	const feature = 'getReportList'
	const options = jsonfile.readFileSync('./options.json')

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

	response = await reports.getReportList()

	response = response.GetReportListResult
	fs.writeFileSync(`${dumpFolder}/reports/${feature}.json`, JSON.stringify(response, null, 2))

}

async function getReportCount() {

	const dumpFile = 'getReportCount'
	const options = jsonfile.readFileSync('./options.json')

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

	const feature = `${dumpFile[0].toUpperCase() + dumpFile.slice(1)}Result`
	response = response[feature]
	fs.writeFileSync(`${dumpFolder}/reports/${dumpFile}.json`, JSON.stringify(response, null, 2))

}

async function getReportScheduleList() {

	// TODO se o metodo de pegar o nome da function funcionar, tambem mudar em todos os testes
	const dumpFile = 'getReportScheduleList'
	const options = jsonfile.readFileSync('./options.json')

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

	const feature = `${dumpFile[0].toUpperCase() + dumpFile.slice(1)}Result`
	response = response[feature]
	fs.writeFileSync(`${dumpFolder}/reports/${dumpFile}.json`, JSON.stringify(response, null, 2))

}

async function getReportScheduleCount() {

	// TODO se o metodo de pegar o nome da function funcionar, tambem mudar em todos os testes
	const dumpFile = 'getReportScheduleCount'
	const options = jsonfile.readFileSync('./options.json')

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

	const feature = `${dumpFile[0].toUpperCase() + dumpFile.slice(1)}Result`
	response = response[feature]
	fs.writeFileSync(`${dumpFolder}/reports/${dumpFile}.json`, JSON.stringify(response, null, 2))

}

async function testReportsApiFunctions() {

	await getReportScheduleCount()
	await getReportScheduleList()
	await getReportCount()
	await getReportList()
	await getReportRequestListByNextToken()

}

(async () => {

	await testReportRequestTypes()
	// await testReportsApiFunctions()

})()
