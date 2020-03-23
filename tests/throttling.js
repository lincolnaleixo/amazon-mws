/* eslint-disable max-lines-per-function */
const Configurati = require('configurati')
const cawer = require('cawer')
const fs = require('fs')
const Reports = require('../src/reports.js')
const options = require('../options.json')

// eslint-disable-next-line complexity
const reportTypes = require('../resources/reportTypes.json')(async () => {

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

	const dumpFolder = 'dump'

	fs.readdirSync(dumpFolder)
		.forEach((file) => {

			inventoryReportsType = inventoryReportsType.filter((item) => item !== file.replace('.json', ''))

		})

	for (const reportType of inventoryReportsType) {

		let backOffTimer = 2

		// const startDate = '2020-02-29T00:00:00'
		// const endDate = '2020-02-29T23:00:00'
		console.log('Requesting report for report type', reportType)

		try {

			response = await reports.requestReport(reportType)

		} catch (err) {

			console.log(err.stack)
			if (err.message.indexOf('Invalid Report Type') > -1) {

				fs.writeFileSync(`dump/${reportType}.json`, err.message)

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

			if (processingStatus === '_SUBMITTED_' && processingStatus === '_IN_PROGRESS_') {

				console.log('Report not ready')
				await cawer.sleep(backOffTimer)
				backOffTimer *= 2
				continue

			}

			if (processingStatus === '_CANCELLED_' || processingStatus === '_DONE_NO_DATA_') {

				console.log('Report cancelled or no data')
				fs.writeFileSync(`dump/${reportType}.json`, 'Cancelled or no data')
				break

			}

			if (processingStatus === '_DONE_') {

				console.log('Report done')

				const reportId = response
					.GetReportRequestListResult[0]
					.ReportRequestInfo[0]
					.GeneratedReportId[0]

				response = await reports.getReport(reportId)
				fs.writeFileSync(`dump/${reportType}.json`, JSON.stringify(response, null, 2))
				console.log(JSON.stringify(response, null, 2))
				break

			}

		}

	}

})()
