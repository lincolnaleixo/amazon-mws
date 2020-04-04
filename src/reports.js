const Core = require('./core')
const Logger = require('../lib/logger')
const requiredParams = require('../resources/requiredParams.json')

// TODO jsdoc de todos os metodos

class Reports {

	constructor(credentials) {

		const className = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('new')[1].split('(')[0].trim()
		this.api = className

		this.core = new Core()
		this.logger = new Logger(this.api)
		this.logger = this.logger.get()

		this.credentials = credentials
		this.headers = requiredParams[this.api].headers

	}

	/** Request report from MWS.
		Maximum request quota: 15 requests;
		Restore rate: One request every minute;
		Hourly request quota: 60 requests per hour;
	 * @param {string} reportType
	 * @param {date} startDate
	 * @param {date} endDate
	 */
	async requestReport(reportType, startDate, endDate) {

		// TODO add MarketplaceIdList and reportOptions params

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { ReportType: reportType }

		if (startDate) params.StartDate = startDate
		if (endDate) params.EndDate = endDate

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName] ? response[attrName] : response.ErrorResponse

		// return response.error ? response : response.RequestReportResponse

	}

	async handleNextTokens(
		response, reportResult, attrName, fnName, action,
	) {

		// TODO paremetro para definir até quantos nextTokens deve ir
		this.logger.info('There is next token, requesting it')
		let nextToken = response[attrName][`${action}Result`].NextToken
		let resultToReturn = reportResult[`${action}Result`].ReportInfo
		let nextTokenCount = 0

		while (true) {

			const nextTokenResponse = await this[`${fnName}ByNextToken`](nextToken)
			const nextTokenResult = nextTokenResponse[`${action}ByNextTokenResult`].ReportInfo
			resultToReturn = [ ...resultToReturn, ...nextTokenResult ]

			if (nextTokenResponse[`${action}ByNextTokenResult`].HasNext === 'false') break

			nextToken = nextTokenResponse[`${action}ByNextTokenResult`].NextToken
			nextTokenCount += 1
			this.logger.info('Still next token present, waiting 3 seconds and requesting it')
			if (nextTokenCount === 2) break
			await this.core.cawer.sleep(3)

		}

		const result = {}
		result[`${action}Result`] = {}
		// result[`${action}Result`].data = {}
		result[`${action}Result`].data = resultToReturn
		result[`${action}Result`].nextTokenCount = nextTokenCount

		return result

	}

	async getReportRequestList(reportRequestId) {

		// TODO change ReportRequestIdList as list
		// TODO add MaxCount, RequestedFromDate, RequestedToDate, ReportTypeList and ReportProcessingStatusList params

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { 'ReportRequestIdList.Id.1': reportRequestId }

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)
		let responseToReturn = response[attrName]

		if (responseToReturn[`${action}Result`].HasNext !== 'false') {

			responseToReturn = await this.handleNextTokens(
				response, responseToReturn, attrName, fnName, action,
			)

		}

		return responseToReturn

	}

	async getReportRequestListByNextToken(nextToken) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { NextToken: nextToken }

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReportRequestCount() {

		// TODO se isso funcionar, colocar em todos os metodos
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		// TODO add optional parameters

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReportList(handleNextTokens = false) {

		// TODO add optional parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
		}

		const response = await this.core.requestMws(requestInfo)
		let reportResult = response[attrName]

		if (handleNextTokens && reportResult[`${action}Result`].HasNext !== 'false') {

			reportResult = await this.handleNextTokens(
				response, reportResult, attrName, fnName, action,
			)

		}

		return reportResult

	}

	async getReportListByNextToken(nextToken) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { NextToken: nextToken }

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReportCount() {

		// TODO ver como melhor isso, sera que da pacolr em cawer? testar...
		// TODO se isso funcionar, colocar em todos os metodos
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		// TODO add optional parameters

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReportScheduleList() {

		// TODO add optional parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()
		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReportScheduleListByNextToken(nextToken) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const params = { NextToken: nextToken }

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReportScheduleCount() {

		// TODO add optional parameters

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()
		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
		}

		const response = await this.core.requestMws(requestInfo)

		return response[attrName]

	}

	async getReport(reportId) {

		// TODO add optional parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		const action = fnName[0].toUpperCase() + fnName.slice(1)

		const params = { ReportId: reportId }

		const requestInfo = {
			action,
			api: this.api,
			credentials: this.credentials,
			headers: this.headers,
			params,
		}

		const response = await this.core.requestMws(requestInfo)

		// Report came already with response, no need to get attribute
		return response

	}

	//* custom methods
	async startReport(reportType) {

		const SECONDS_WAIT_LOOP = 5

		while (true) {

			try {

				let reportData

				this.logger.warn(`Requesting report ${reportType}`)
				const reportRequestResponse = await this.requestReport(reportType)
				const reportRequestId = reportRequestResponse.RequestReportResult.ReportRequestInfo.ReportRequestId
				this.logger.info(`Report Request Id: ${reportRequestId}`)

				this.logger.info(`Waiting ${SECONDS_WAIT_LOOP} ms before checking the status of recently created report request...`)
				await this.core.cawer.sleep(SECONDS_WAIT_LOOP)
				const reportId = await this.waitForReport(reportRequestId)
				await this.logger.info(`Report ${reportType} ready, id: ${reportId}`)

				if (reportId === 'Cancelled/NoData') return 'Report cancelled or no data'

				if (reportId !== undefined || reportId !== false) {

					reportData = await this.getReport(reportId)

					return reportData

				}

				this.logger.error('Received report ID undefined/false, waiting 15 seconds and trying again...')
				await this.core.cawer.sleep(15)

			} catch (error) {

				this.logger.error(`Error on startReport(${reportType})`)
				this.logger.error(typeof error === 'object' ? error.stack : error)

			}

			return false

		}

	}

	async waitForReport(reportRequestId) {

		let response = ''
		let backOffTimer = 2

		while (true) {

			response = await this.getReportRequestList(reportRequestId)
			const processingStatus = await response
				.GetReportRequestListResult.ReportRequestInfo.ReportProcessingStatus

			if (processingStatus === '_SUBMITTED_' || processingStatus === '_IN_PROGRESS_') {

				this.logger.info('Report not ready')
				await this.core.cawer.sleep(backOffTimer)
				backOffTimer *= 2
				continue

			}

			if (processingStatus === '_CANCELLED_' || processingStatus === '_DONE_NO_DATA_') {

				this.logger.info('Report cancelled or no data')

				return 'Cancelled/NoData'

			}

			if (processingStatus === '_DONE_') {

				this.logger.info('Report done')

				const reportId = response
					.GetReportRequestListResult.ReportRequestInfo.GeneratedReportId

				return reportId

			}

		}

	}

	async getCustomInventoryReports() {

		// Ver como dinamicamente adicionar isso sem precisar ter que adicionar um const para cada metodo

		const [ reportInfoListingAllData, reportInfoEstimatedFbaFees ] = await Promise
			.all([ this.startReport('_GET_MERCHANT_LISTINGS_ALL_DATA_'), this.startReport('_GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA_') ])

		const response = {
			...reportInfoListingAllData, ...reportInfoEstimatedFbaFees,
		}

		return response

	}

}

module.exports = Reports
