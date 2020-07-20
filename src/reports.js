const Cawer = require('cawer')
const jsonfile = require('jsonfile')
const path = require('path')
const Core = require('./core')

let jsonResponse

const cawer = new Cawer()

class Reports extends Core {

	/**
	 * @param {string} reportType
	 */
	async requestReport(reportType) {
		let reportRequestId
		console.log('Requesting report type', reportType)

		jsonResponse = await this.request({
			Action: 'RequestReport',
			ActionParams: { ReportType: reportType },
		})
		// if (jsonResponse === false) throw new Error('')
		try {
			reportRequestId = jsonResponse
				.RequestReportResponse.RequestReportResult.ReportRequestInfo.ReportRequestId
		} catch (err) {
			console.log(`Error on ${err}`)
		}

		return reportRequestId
	}

	/**
	 * @param {string} reportRequestId
	 */
	async waitReportCompletition(reportRequestId) {
		console.log(`Waiting for completion of report request id: ${reportRequestId}`)
		let generatedReportId
		let sleeptimer = 2
		while (true) {
			jsonResponse = await this.request({
				Action: 'GetReportRequestList',
				ActionParams: { 'ReportRequestIdList.Id.1': reportRequestId },
			})
			const reportProcessingStatus = jsonResponse
				.GetReportRequestListResponse.GetReportRequestListResult.ReportRequestInfo.ReportProcessingStatus
			console.log(`${reportRequestId} status: ${reportProcessingStatus}`)
			if (reportProcessingStatus === '_DONE_') {
				generatedReportId = jsonResponse
					.GetReportRequestListResponse.GetReportRequestListResult.ReportRequestInfo.GeneratedReportId

				return generatedReportId
			} if (reportProcessingStatus === '_IN_PROGRESS_' || reportProcessingStatus === '_SUBMITTED_') {
				cawer.sleep(sleeptimer)
				sleeptimer *= 2
			} else {
				return { Status: reportProcessingStatus }
			}
		}
	}

	/**
	 * @param {string} generatedReportId
	 */
	async getReport(generatedReportId) {
		console.log('Done. Getting report information')

		jsonResponse = await this.request({
			Action: 'GetReport',
			ActionParams: { ReportId: generatedReportId },
		})

		return jsonResponse
	}

	/**
	 * @param {string} reportType
	 */
	async processReport(reportType) {
		let reportInfo
		// Requesting report
		const reportRequestId = await this.requestReport(reportType)
		// Check report status and waiting for report completion
		const reportResponse = await this.waitReportCompletition(reportRequestId)
		if (typeof reportResponse === 'string') {
			// Getting report info
			const generatedReportId = reportResponse
			reportInfo = await this.getReport(generatedReportId)
		} else {
			reportInfo = reportResponse
		}

		return reportInfo
	}
}

module.exports = Reports
