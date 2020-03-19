/* eslint-disable max-lines-per-function */
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const csvtojson = require('csvtojson')
const cawer = require('cawer')
const Core = require('./core')
// TODO jsdoc de todos os metodos

class Reports {

	constructor(credentials) {

		this.core = new Core()
		this.api = 'Reports'
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
		let jsonResponse = {}

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

		const response = await fetch(url, {
			method: 'POST',
			headers: this.headers,
		})

		const xml = await response.text()

		const xmlParser = new xml2js.Parser({
			mergeAttrs: true,
			explicitArray: false,
			emptyTag: {},
			charkey: 'Value',
		})
		jsonResponse = await xmlParser.parseStringPromise(xml /* , options */)
		// console.log(JSON.stringify(jsonResponse, null, 2))

		if (jsonResponse.ErrorResponse && jsonResponse.ErrorResponse.Error.Code === 'InvalidReportType') {

			throw new Error(jsonResponse.ErrorResponse.Error.Message)

		}

		return jsonResponse.RequestReportResponse

	}

	async getReportRequestList(reportRequestId, backOffTimer = 2) {

		// TODO change ReportRequestIdList as list
		// TODO add MaxCount, RequestedFromDate, RequestedToDate, ReportTypeList and ReportProcessingStatusList params
		let jsonResponse = {}

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

		const response = await fetch(url, {
			method: 'POST',
			headers: this.headers,
		})

		const xml = await response.text()
		const xmlParser = new xml2js.Parser({
			mergeAttrs: true,
			explicitArray: false,
			emptyTag: {},
			charkey: 'Value',
		})
		jsonResponse = await xmlParser.parseStringPromise(xml /* , options */)

		if (jsonResponse.ErrorResponse) {

			if (jsonResponse.ErrorResponse.Error.Code !== 'RequestThrottled') {

				throw new Error(JSON.stringify(jsonResponse, null, 2))

			}

			const errorMessage = jsonResponse.ErrorResponse.Error.Message
			console.log(`${errorMessage}. Trying again in ${backOffTimer} seconds`)
			await cawer.sleep(backOffTimer)

			return this.getReportRequestList(reportRequestId, backOffTimer * 2)

		}

		return jsonResponse.GetReportRequestListResponse

	}

	async getReport(reportId) {

		let jsonResponse = {}

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

		const response = await fetch(url, {
			method: 'POST',
			headers: this.headers,
		})

		const csv = await response.text()
		jsonResponse = await csvtojson({
			delimiter: '\t',
			output: 'json',
		})
			.fromString(csv)

		return jsonResponse

	}

}

module.exports = Reports
