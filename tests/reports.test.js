const jsonfile = require('jsonfile')
const path = require('path')
const Reports = require('../src/reports.js')
require('dotenv').config()

const reportTypes = [
	'_GET_FLAT_FILE_OPEN_LISTINGS_DATA_',
	'_GET_MERCHANT_LISTINGS_ALL_DATA_',
	'_GET_MERCHANT_LISTINGS_DATA_',
	'_GET_MERCHANT_LISTINGS_INACTIVE_DATA_',
	'_GET_MERCHANT_LISTINGS_DATA_BACK_COMPAT_',
	'_GET_MERCHANT_LISTINGS_DATA_LITE_',
	'_GET_MERCHANT_LISTINGS_DATA_LITER_',
	'_GET_MERCHANT_CANCELLED_LISTINGS_DATA_',
	'_GET_CONVERGED_FLAT_FILE_SOLD_LISTINGS_DATA_',
	'_GET_MERCHANT_LISTINGS_DEFECT_DATA_',
	'_GET_FLAT_FILE_GEO_OPPORTUNITIES_',
	'_GET_REFERRAL_FEE_PREVIEW_REPORT_',
	'_GET_PAN_EU_OFFER_STATUS_',
	// '_GET_MFN_PAN_EU_OFFER_STATUS_' - Only for EU markertplaces,
]
const credentials = {
	AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	SecretAccessKey: process.env.SECRET_ACCESS_KEY,
	SellerId: process.env.SELLER_ID,
	MarketplaceId: process.env.MARKETPLACE_ID,
}

async function processReport(reportType) {
	const dumpFolder = 'dump'
	const dumpFile = `${reportType}.json`
	const reports = new Reports(credentials)
	let reportInfo
	// Requesting report
	const reportRequestId = await reports.requestReport(reportType)
	// Check report status and waiting for report completion
	const reportResponse = await reports.waitReportCompletition(reportRequestId)
	if (typeof reportResponse === 'string') {
		// Getting report info
		const generatedReportId = reportResponse
		reportInfo = await reports.getReport(generatedReportId)
	} else {
		reportInfo = reportResponse
	}
	console.log('Saving report information')
	jsonfile.writeFileSync(path.join(dumpFolder, dumpFile), reportInfo, { spaces: 2 })
	console.log(`${reportType} information saved`)

	return true
}

(async () => {
	for (let i = 0; i < reportTypes.length; i += 1) {
		await processReport(reportTypes[i])
	}

	console.log('Testing Reports Ended')
})()
