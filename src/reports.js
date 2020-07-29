const Cawer = require('cawer')
const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const { exception } = require('console')
const Core = require('./core')
const cawer = new Cawer()

class Reports extends Core {

	/**
	 * @param {string} reportType
	 */
	async requestReport(reportType) {
		let reportRequestId
		console.log('Requesting report type', reportType)

		const jsonResponse = await this.request({
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
	 * @param {string} reportType
	 */
	async waitReportCompletition(reportRequestId, reportType) {
		console.log(`Waiting for completion of report request id: ${reportRequestId}`)
		let sleeptimer = 2
		while (true) {
			const jsonResponse = await this.request({
				Action: 'GetReportRequestList',
				ActionParams: { 'ReportRequestIdList.Id.1': reportRequestId },
			})
			const reportProcessingStatus = jsonResponse
				.GetReportRequestListResponse.GetReportRequestListResult.ReportRequestInfo.ReportProcessingStatus
			console.log(`${reportRequestId} status: ${reportProcessingStatus}`)
			if (reportProcessingStatus === '_DONE_') {
				return jsonResponse
					.GetReportRequestListResponse.GetReportRequestListResult.ReportRequestInfo.GeneratedReportId
			} if (reportProcessingStatus === '_CANCELLED_') {
				console.log('Report request cancelled. Trying to get last report available')
				const reportId = await this.getLastAvailableReport(reportType)

				return reportId
			}
			if (reportProcessingStatus === '_IN_PROGRESS_' || reportProcessingStatus === '_SUBMITTED_') {
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

		const jsonResponse = await this.request({
			Action: 'GetReport',
			ActionParams: { ReportId: generatedReportId },
		})

		return jsonResponse
	}

	/**
	 * @param {string} reportType
	 */
	async getLastAvailableReport(reportType) {
		try {
			const jsonResponse = await this.request({
				Action: 'GetReportList',
				ActionParams: { 'ReportTypeList.Type.1': reportType },
			})
			const reportId = jsonResponse.GetReportListResponse.GetReportListResult.ReportInfo[0].ReportId

			return reportId
		} catch (err) {
			throw new Error(`Error on getLastAvailableReport: ${err}`)
		}
	}

	/**
	 * @param {string} cacheFolder`
	 * @param {string} reportType
	 */
	getMinutesFileSaved(cacheFolder, reportType) {
		const fileStats = fs.statSync(path.join(cacheFolder, `${reportType}.json`))
		const dateFileCreation = moment.utc(fileStats.atime).format('YYYY-MM-DDTHH:mm:ss')
		const dateNow = moment().utc()
			.format('YYYY-MM-DDTHH:mm:ss')
		const duration = moment.duration(moment(dateNow).diff(moment(dateFileCreation)))

		return duration.asMinutes()
	}

	/**
	 * @param {string} reportType
	 */
	async processReport(reportType, cacheMinutes = 30) {
		const cacheFolder = path.join(__dirname, '..', 'cache')
		// if (reportCategory !== undefined) cacheFolder = path.join(cacheFolder, reportCategory)
		let reportInfo
		if (cacheMinutes && fs.existsSync(path.join(cacheFolder, `${reportType}.json`))) {
			const minutes = this.getMinutesFileSaved(cacheFolder, reportType)
			if (minutes <= cacheMinutes) {
				console.log('Cache is valid')

				return jsonfile.readFileSync(path.join(cacheFolder, `${reportType}.json`))
			}
		}
		const reportRequestId = await this.requestReport(reportType)
		const reportResponse = await this.waitReportCompletition(reportRequestId, reportType)
		if (typeof reportResponse === 'string') {
			const generatedReportId = reportResponse
			reportInfo = await this.getReport(generatedReportId)
		} else reportInfo = reportResponse

		if (cacheMinutes) {
			fs.ensureDirSync(path.join(cacheFolder))
			jsonfile.writeFileSync(path.join(cacheFolder, `${reportType}.json`), reportInfo, { spaces: 2 })
		}

		return reportInfo
	}
}

module.exports = Reports
