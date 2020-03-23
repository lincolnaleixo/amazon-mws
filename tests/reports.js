/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const cawer = require('cawer')
const fs = require('fs')
const Logger = require('../lib/logger')
const Reports = require('../src/reports.js')
const reportTypes = require('../resources/reportTypes.json')
const options = require('../options.json');

// eslint-disable-next-line complexity
(async () => {

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

	let inventoryReportsType = reportTypes.inventory

	const dumpFolder = `${options.dumpFolder}/${feature}`

	fs.readdirSync(dumpFolder)
		.forEach((file) => {

			inventoryReportsType = inventoryReportsType.filter((item) => item !== file.replace('.json', ''))

		})

	for (const reportType of inventoryReportsType) {

		let backOffTimer = 2

		// const startDate = '2020-02-29T00:00:00'
		// const endDate = '2020-02-29T23:00:00'
		this.logger.info(`Requesting report for report type ${reportType}`)

		try {

			response = await reports.requestReport(reportType)

		} catch (err) {

			this.logger.debug(err.stack)
			if (err.message.indexOf('Invalid Report Type') > -1) {

				fs.writeFileSync(`${dumpFolder}/${reportType}.json`, err.message)

			}

			continue

		}

		const reportRequestId = response
			.RequestReportResult[0]
			.ReportRequestInfo[0]
			.ReportRequestId[0]

		while (true) {

			response = await reports.getReportRequestList(reportRequestId)
			const processingStatus = await response
				.GetReportRequestListResult[0]
				.ReportRequestInfo[0]
				.ReportProcessingStatus[0]

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
					.GetReportRequestListResult[0]
					.ReportRequestInfo[0]
					.GeneratedReportId[0]

				response = await reports.getReport(reportId)
				fs.writeFileSync(`${dumpFolder}/${reportType}.json`, JSON.stringify(response, null, 2))
				// this.logger.info(JSON.stringify(response, null, 2))
				break

			}

		}

	}

})()
