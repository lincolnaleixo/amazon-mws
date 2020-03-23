/* eslint-disable max-lines-per-function */
const Core = require('./core')
const Logger = require('../lib/logger')

// TODO jsdoc de todos os metodos

class Reports {

	constructor(credentials) {

		this.api = 'Reports'
		this.feature = this.api.toLowerCase()

		this.core = new Core()
		this.logger = new Logger(this.feature)
		this.logger = this.logger.get()

		this.credentials = credentials
		this.endpoint = 'https://mws.amazonservices.com/'
		this.headers = { 'Content-Type': 'text/xml' }

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
		// const jsonResponse = {}

		const action = 'RequestReport'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)
		const params = { ReportType: reportType }

		if (startDate) params.StartDate = startDate
		if (endDate) params.EndDate = endDate

		const paramEntries = Object.entries({
			...requiredParams, ...params,
		})

		const urlParams = new URLSearchParams(paramEntries)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response.error ? response : response.RequestReportResponse

	}

	async getReportRequestList(reportRequestId) {

		// TODO change ReportRequestIdList as list
		// TODO add MaxCount, RequestedFromDate, RequestedToDate, ReportTypeList and ReportProcessingStatusList params
		// const jsonResponse = {}

		const action = 'GetReportRequestList'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)
		const params = { 'ReportRequestIdList.Id.1': reportRequestId }

		const paramEntries = Object.entries({
			...requiredParams, ...params,
		})

		const urlParams = new URLSearchParams(paramEntries)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response.GetReportRequestListResponse

	}

	async getReportRequestListByNextToken(nextToken) {

		const action = 'GetReportRequestListByNextToken'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)
		const params = { NextToken: nextToken }

		const paramEntries = Object.entries({
			...requiredParams, ...params,
		})

		const urlParams = new URLSearchParams(paramEntries)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response.GetReportRequestListByNextTokenResponse

	}

	async getReportList() {

		// TODO add optional parameters

		const action = 'GetReportList'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		// const paramEntries = Object.entries({
		// 	...requiredParams, ...params,
		// })

		const urlParams = new URLSearchParams(requiredParams)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response.GetReportListResponse

	}

	async getReportCount() {

		// TODO ver como melhor isso, sera que da para colocar em cawer? testar...
		// TODO se isso funcionar, colocar em todos os metodos
		// const error = new Error()
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()
		// const fnName = ((((new Error().stack.split('at ') || [])[1] || '').match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '')
		// 	.split('.')
		// 	.pop()
		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		// TODO add optional parameters

		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		// const paramEntries = Object.entries({
		// 	...requiredParams, ...params,
		// })

		const urlParams = new URLSearchParams(requiredParams)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getReportScheduleList() {

		// TODO add optional parameters
		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()
		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		// const paramEntries = Object.entries({
		// 	...requiredParams, ...params,
		// })

		const urlParams = new URLSearchParams(requiredParams)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getReportScheduleCount() {

		// TODO add optional parameters

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()
		const action = fnName[0].toUpperCase() + fnName.slice(1)
		const attrName = `${action}Response`

		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)

		// const paramEntries = Object.entries({
		// 	...requiredParams, ...params,
		// })

		const urlParams = new URLSearchParams(requiredParams)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response[attrName]

	}

	async getReport(reportId) {

		const action = 'GetReport'
		const requiredParams = this.core.getRequiredParams(action, this.api, this.credentials)
		const params = { ReportId: reportId }

		const paramEntries = Object.entries({
			...requiredParams, ...params,
		})

		const urlParams = new URLSearchParams(paramEntries)
		urlParams.sort()

		const signature = this.core
			.signString(urlParams,
				this.api,
				requiredParams.Version,
				this.credentials.secretAccessKey)
		urlParams.append('Signature', signature)

		const url = `${this.endpoint}?${urlParams}`

		const response = await this.core.requestMws(url, this.headers)

		return response

	}

}

module.exports = Reports
