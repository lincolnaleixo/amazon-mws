
const Cawer = require('cawer')
const Core = require('./core')

let jsonResponse

const cawer = new Cawer()

class Reports extends Core {

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

	async getReport(generatedReportId) {
		console.log('Done. Getting report information')

		jsonResponse = await this.request({
			Action: 'GetReport',
			ActionParams: { ReportId: generatedReportId },
		})

		return jsonResponse
	}
}

module.exports = Reports
