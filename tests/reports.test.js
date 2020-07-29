const jsonfile = require('jsonfile')
const path = require('path')
const Reports = require('../src/reports.js')
require('dotenv').config()

const inventoryReportTypes = [
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
const fbaReports = [ '_GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA_' ]
const credentials = {
	AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	SecretAccessKey: process.env.SECRET_ACCESS_KEY,
	SellerId: process.env.SELLER_ID,
	MarketplaceId: process.env.MARKETPLACE_ID,
};

(async () => {
	const reports = new Reports(credentials)
	// for (let i = 0; i < inventoryReportTypes.length; i += 1) {
	// 	const response = await reports.processReport(inventoryReportTypes[i], 30)
	// 	console.log(response)
	// }

	for (let i = 0; i < fbaReports.length; i += 1) {
		await reports.processReport(fbaReports[i], 30)
	}

	console.log('Testing Reports Ended')
})()
