const DefaultApi = require('../api/DefaultApi')

// TODO return types
// TODO add throttling
// TODO params object types definition
// TODO marketplaceid aceitando por country code
// TODO implement wait for necessary methods.

/**
 * @summary Reports API implementation
 * @description The Reports API section of the Amazon Marketplace Web Service (Amazon MWS) API lets you request various reports that help you manage your Sell on Amazon business. Report types are specified using the ReportTypes enumeration.
 * @class Reports
 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_Overview.html API reference}
 */
class Reports extends DefaultApi {

	/**
	 * @param {Credentials} credentials Credentials to be used on the API
	 * @param {('BR' | 'CA' | 'MX' | 'US' | 'AE' | 'DE' | 'ES' | 'FR' | 'GB' | 'IT' | 'EG' | 'NL' | 'SA' | 'SE' | 'TR' | 'IN' | 'SG' | 'AU' | 'JP')} marketplaceCountryCode Country code of desired marketplace to be used in API
	 */
	constructor(credentials, marketplaceCountryCode) {
		super(credentials, marketplaceCountryCode, 'Reports')
	}

	/**
	 * @summary Creates a report request and submits the request to Amazon MWS.
	 * @description <p>The RequestReport operation creates a report request. Amazon MWS processes the report request and when the report is completed, sets the status of the report request to _DONE_. Reports are retained for 90 days.</p>
	 * <p>You specify what marketplaces you want a report to cover by supplying a list of marketplace IDs to the optional MarketplaceIdList request parameter when you call the RequestReport operation. If you do not specify a marketplace ID, your home marketplace ID is used. Note that the MarketplaceIdList request parameter is not used in the Japan marketplace.</p>
	 * <p>The RequestReport operation has a maximum request quota of 15 and a restore rate of one request every minute. For definitions of throttling terminology and for a complete explanation of throttling, see Throttling: Limits to how often you can submit requests in the Amazon MWS Developer Guide.</p>
	 * @async
	 * @function requestReport
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_RequestReport.html API reference}
	 * @param {string} ReportType A value of the ReportType that indicates the type of report to request. <p>One of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html Report types} </p>
	 * @param {date} [StartDate='Now'] The start of a date range used for selecting the data to report. Must be prior to or equal to the current time.
	 * @param {date} [EndDate='Now'] The end of a date range used for selecting the data to report.
	 * @param {string} [ReportOptions] Additional information to pass to the report.
	 * @returns {object} Detailed information about a report request.
	 */
	async requestReport(ReportType, StartDate, EndDate, ReportOptions) {
		const action = this.getActionName()
		const params = {
			ReportType,
			StartDate: StartDate || this.moment().toISOString(),
			EndDate: EndDate || this.moment().toISOString(),
		}
		if (ReportOptions) params.ReportOptions = ReportOptions
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a list of report requests that you can use to get the ReportRequestId for a report.
	 * @description <p>The GetReportRequestList operation returns a list of report requests that match the query parameters. You can specify query parameters for report status, date range, and report type. The list contains the ReportRequestId for each report request. You can obtain ReportId values by passing the ReportRequestId values to the GetReportList operation.</p>
	 * <p>In the first request, a maximum of 100 report requests are returned. If there are additional report requests to return, HasNext is returned set to true in the response . To retrieve all the results, you can pass the value of the NextToken parameter to call GetReportRequestListByNextToken operation iteratively until HasNext is returned set to false.</p>
	 * @async
	 * @function getReportRequestList
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportRequestList.html API reference}
	 * @param {[string]} [ReportRequestIdList] A structured list of ReportRequestId values. If you pass in ReportRequestId values, other query conditions are ignored.
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @param {[('_SUBMITTED_' | '_IN_PROGRESS_' | '_CANCELLED_' | '_DONE_' | '_DONE_NO_DATA_')]} ReportProcessingStatusList A structured list of report processing statuses by which to filter report requests.
	 * @param {int} MaxCount A non-negative integer that represents the maximum number of report requests to return. If you specify a number greater than 100, the request is rejected.
	 * @param {date} [RequestedFromDate='Now'] The start of the date range used for selecting the data to report, in ISO 8601 date time format.
	 * @param {date} [RequestedToDate='Now'] The end of the date range used for selecting the data to report, in ISO 8601 date time format.
	 * @returns {object} The response elements that the GetReportRequestList operation returns
	 */
	async getReportRequestList(
		ReportRequestIdList = [], ReportTypeList = [],
		ReportProcessingStatusList = [], MaxCount = 10,
		RequestedFromDate = undefined, RequestedToDate = undefined,
	) {
		const action = this.getActionName()
		const params = { MaxCount }
		for (let i = 0; i < ReportRequestIdList.length; i += 1) {
			params[`ReportRequestIdList.Id.${i + 1}`] = ReportRequestIdList[i]
		}
		for (let i = 0; i < ReportTypeList.length; i += 1) {
			params[`ReportTypeList.Type.${i + 1}`] = ReportTypeList[i]
		}
		for (let i = 0; i < ReportProcessingStatusList.length; i += 1) {
			params[`ReportProcessingStatusList.Status.${i + 1}`] = ReportProcessingStatusList[i]
		}
		if (RequestedFromDate) params.RequestedFromDate = RequestedFromDate
		if (RequestedToDate) params.RequestedToDate = RequestedToDate
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a list of report requests using the NextToken, which was supplied by a previous request to either GetReportRequestListByNextToken or GetReportRequestList, where the value of HasNext was true in that previous request.
	 * @description The GetReportRequestListByNextToken operation returns a list of report requests that match the query parameters. This operation uses the NextToken, which was supplied by a previous request to either GetReportRequestListByNextToken or a request to GetReportRequestList, where the value of HasNext was true in that previous request.
	 * @async
	 * @function getReportRequestListByNextToken
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportRequestListByNextToken.html API reference}
	 * @param {string} NextToken A string token returned in a previous call. Use the NextToken to call the operation again if the return value of HasNext is true.
	 * @returns {object} The response elements that the GetReportRequestListByNextToken operation returns
	 */
	async getReportRequestListByNextToken(NextToken) {
		const action = this.getActionName()
		const params = { NextToken }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a count of report requests that have been submitted to Amazon MWS for processing.
	 * @description The GetReportRequestCount returns the total number of report requests that have been submitted to Amazon MWS for processing.
	 * @async
	 * @function getReportRequestCount
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportRequestCount.html API reference}
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @param {[('_SUBMITTED_' | '_IN_PROGRESS_' | '_CANCELLED_' | '_DONE_' | '_DONE_NO_DATA_')]} ReportProcessingStatusList A structured list of report processing statuses by which to filter report requests.
	 * @param {date} [RequestedFromDate='Now'] The start of the date range used for selecting the data to report, in ISO 8601 date time format.
	 * @param {date} [RequestedToDate='Now'] The end of the date range used for selecting the data to report, in ISO 8601 date time format.
	 * @returns {object} The response elements that the GetReportRequestCount operation returns
	 */
	async getReportRequestCount(ReportTypeList = [], ReportProcessingStatusList = [],
		RequestedFromDate = undefined, RequestedToDate = undefined) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < ReportTypeList.length; i += 1) {
			params[`ReportTypeList.Type.${i + 1}`] = ReportTypeList[i]
		}
		for (let i = 0; i < ReportProcessingStatusList.length; i += 1) {
			params[`ReportProcessingStatusList.Status.${i + 1}`] = ReportProcessingStatusList[i]
		}
		if (RequestedFromDate) params.RequestedFromDate = RequestedFromDate
		if (RequestedToDate) params.RequestedToDate = RequestedToDate
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Cancels one or more report requests.
	 * @description The CancelReportRequests operation cancels one or more report requests, returning the count of the canceled report requests and the report request information. You can cancel more than 100 report requests, but information is only returned for the first 100 report requests canceled. To return information on a greater number of canceled report requests, use the GetReportRequestList operation.
	 * <p><b>Note</b>: If report requests have already begun processing, they cannot be canceled.</p>
	 * @async
	 * @function cancelReportRequests
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_CancelReportRequests.html API reference}
	 * @param {[string]} [ReportRequestIdList] A structured list of ReportRequestId values. If you pass in ReportRequestId values, other query conditions are ignored.
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @param {[('_SUBMITTED_' | '_IN_PROGRESS_' | '_CANCELLED_' | '_DONE_' | '_DONE_NO_DATA_')]} ReportProcessingStatusList A structured list of report processing statuses by which to filter report requests.
	 * @param {date} [RequestedFromDate='Now'] The start of the date range used for selecting the data to report, in ISO 8601 date time format.
	 * @param {date} [RequestedToDate='Now'] The end of the date range used for selecting the data to report, in ISO 8601 date time format.
	 * @returns {object} The response elements that the CancelReportRequests operation returns
	 */
	async cancelReportRequests(
		ReportRequestIdList = [], ReportTypeList = [],
		ReportProcessingStatusList = [],
		RequestedFromDate = undefined, RequestedToDate = undefined,
	) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < ReportRequestIdList.length; i += 1) {
			params[`ReportRequestIdList.Id.${i + 1}`] = ReportRequestIdList[i]
		}
		for (let i = 0; i < ReportTypeList.length; i += 1) {
			params[`ReportTypeList.Type.${i + 1}`] = ReportTypeList[i]
		}
		for (let i = 0; i < ReportProcessingStatusList.length; i += 1) {
			params[`ReportProcessingStatusList.Status.${i + 1}`] = ReportProcessingStatusList[i]
		}
		if (RequestedFromDate) params.RequestedFromDate = RequestedFromDate
		if (RequestedToDate) params.RequestedToDate = RequestedToDate
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a list of reports that were created in the previous 90 days.
	 * @description The GetReportList operation returns a list of reports that were created in the previous 90 days that match the query parameters. A maximum of 100 results can be returned in one request. If there are additional results to return, HasNext is returned set to true in the response. To retrieve all the results, you can pass the value of the NextToken parameter to the GetReportListByNextToken operation iteratively until HasNext is returned set to false.
	 * @async
	 * @function getReportList
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportList.html API reference}
	 * @param {int} [MaxCount=10] A non-negative integer that represents the maximum number of report requests to return. If you specify a number greater than 100, the request is rejected.
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @param {boolean} [Acknowledged] A Boolean value that indicates if an order report has been acknowledged by a prior call to UpdateReportAcknowledgements. Set to true to list order reports that have been acknowledged; set to false to list order reports that have not been acknowledged. This filter is valid only with order reports; it does not work with listing reports.
	 * @param {[string]} [ReportRequestIdList] A structured list of ReportRequestId values. If you pass in ReportRequestId values, other query conditions are ignored.
	 * @param {date} [AvailableFromDate='Now'] The earliest date you are looking for, in ISO 8601 date time format.
	 * @param {date} [AvailableToDate='Now'] The most recent date you are looking for, in ISO 8601 date time format.
	 * @returns {object} The response elements that the GetReportList operation returns
	 */
	async getReportList(
		MaxCount = 10, ReportTypeList = [],
		Acknowledged, ReportRequestIdList = [],
		AvailableFromDate = undefined, AvailableToDate = undefined,
	) {
		const action = this.getActionName()
		const params = { MaxCount }
		for (let i = 0; i < ReportTypeList.length; i += 1) {
			params[`ReportTypeList.Type.${i + 1}`] = ReportTypeList[i]
		}
		for (let i = 0; i < ReportRequestIdList.length; i += 1) {
			params[`ReportRequestIdList.Id.${i + 1}`] = ReportRequestIdList[i]
		}
		if (AvailableFromDate) params.AvailableFromDate = AvailableFromDate
		if (AvailableToDate) params.AvailableToDate = AvailableToDate
		if (Acknowledged) params.Acknowledged = Acknowledged
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a list of reports using the NextToken, which was supplied by a previous request to either GetReportListByNextToken or GetReportList, where the value of HasNext was true in the previous call.
	 * @description The GetReportListByNextToken operation returns a list of reports that match the query parameters, using the NextToken, which was supplied by a previous call to either GetReportListByNextToken or a call to GetReportList, where the value of HasNext was true in the previous call.
	 * @async
	 * @function getReportListByNextToken
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportListByNextToken.html API reference}
	 * @param {string} NextToken A string token returned in a previous call. Use the NextToken to call the operation again if the return value of HasNext is true.
	 * @returns {object} The response elements that the GetReportListByNextToken operation returns
	 */
	async getReportListByNextToken(NextToken) {
		const action = this.getActionName()
		const params = { NextToken }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a count of the reports, created in the previous 90 days, with a status of _DONE_ and that are available for download.
	 * @description The GetReportCount operation returns a count of the reports, created in the previous 90 days, that are available for download.
	 * @async
	 * @function getReportCount
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportCount.html API reference}
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @param {boolean} [Acknowledged] A Boolean value that indicates if an order report has been acknowledged by a prior call to UpdateReportAcknowledgements. Set to true to list order reports that have been acknowledged; set to false to list order reports that have not been acknowledged. This filter is valid only with order reports; it does not work with listing reports.
	 * @param {date} [AvailableFromDate='Now'] The earliest date you are looking for, in ISO 8601 date time format.
	 * @param {date} [AvailableToDate='Now'] The most recent date you are looking for, in ISO 8601 date time format.
	 * @returns {object} The response elements that the GetReportCount operation returns
	 */
	async getReportCount(ReportTypeList = [], Acknowledged,
		AvailableFromDate = undefined, AvailableToDate = undefined) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < ReportTypeList.length; i += 1) {
			params[`ReportTypeList.Type.${i + 1}`] = ReportTypeList[i]
		}
		if (AvailableFromDate) params.AvailableFromDate = AvailableFromDate
		if (AvailableToDate) params.AvailableToDate = AvailableToDate
		if (Acknowledged) params.Acknowledged = Acknowledged
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the contents of a report and the Content-MD5 header for the returned report body.
	 * @description The GetReport operation returns the contents of a report and the Content-MD5 header for the returned report body. Reports are retained for 90 days from the time they are generated.
	 * <p>You should compute the MD5 hash of the HTTP body and compare that with the returned Content- MD5 header value. If they do not match, it means the body was corrupted during transmission. If the report is corrupted, you should discard the result and automatically retry the request up to three more times. Please notify Amazon MWS if you receive a corrupted report body. The client library for the Reports API section, found on the Amazon MWS website, contains code for processing and comparing Content-MD5 headers. For more information on working with the Content-MD5 header, see the Amazon MWS Developer Guide.</p>
	 * @async
	 * @function getReport
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReport.html API reference}
	 * @param {int} ReportId A unique identifier of the report to download. For most reports, this identifier is returned either in the ReportId of the GetReportList operation or in the GeneratedReportId of the GetReportRequestList operation. For sellers in India getting Amazon Easy Ship documents, this identifier is returned in the ReportReferenceId element of the processing report of the Easy Ship Feed. For more information see How to get invoice, shipping label, and warranty documents.
	 * @returns {object} The contents of the report document. Depending on the ReportType, this will either be a tab-delimited flat file, an XML document, or a PDF.
	 */
	async getReport(ReportId) {
		const action = this.getActionName()
		const params = { ReportId }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response
	}

	/**
	 * @summary Creates, updates, or deletes a report request schedule for a specified report type.
	 * @description The ManageReportSchedule operation creates, updates, or deletes a report request schedule for a particular report type. Only Order Reports can be scheduled.
	 * <p>By using a combination of the ReportType and Schedule values, Amazon MWS determines which action you want to perform. If no combination of ReportType and Schedule exists, then a new report request schedule is created. If the ReportType is already scheduled but with a different Schedule value, then the report request schedule is updated to use the new Schedule value. If you pass in a ReportType and set the Schedule value to _NEVER_ in the request, the report request schedule for that ReportType is deleted.</p>
	 * @async
	 * @function manageReportSchedule
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ManageReportSchedule.html API reference}
	 * @param {string} ReportType A value of the ReportType that indicates the type of report to request. <p>One of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html Report types} </p>
	 * @param {('_15_MINUTES_' | '_30_MINUTES_' | '_1_HOUR_' | '_2_HOURS_' | '_4_HOURS_' | '_8_HOURS_' | '_12_HOURS_' | '_1_DAY_' | '_2_DAYS_' | '_72_HOURS_' | '_1_WEEK_' | '_14_DAYS_' | '_15_DAYS_' | '_30_DAYS_' | '_NEVER_')} Schedule A value of the Schedule that indicates how often a report request should be created.
	 * @param {date} [ScheduleDate='Now'] The date when the next report request is scheduled to be submitted.
	 * @returns {object} The response elements that the ManageReportSchedule operation returns
	 */
	async manageReportSchedule(ReportType, Schedule = undefined, ScheduleDate = undefined) {
		const action = this.getActionName()
		const params = {
			ReportType, Schedule,
		}
		if (ScheduleDate) params.ScheduleDate = ScheduleDate

		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a list of order report requests that are scheduled to be submitted to Amazon MWS for processing.
	 * @description The GetReportScheduleList operation returns a list of scheduled order report requests that match the query parameters. Only Order Reports can be scheduled. A maximum number of 100 results can be returned in one request.
	 * @async
	 * @function getReportScheduleList
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportScheduleList.html API reference}
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @returns {object} The response elements that the GetReportScheduleList operation returns
	 */
	async getReportScheduleList(ReportTypeList) {
		const action = this.getActionName()
		const params = {}
		for (let i = 0; i < ReportTypeList.length; i += 1) {
			params[`ReportTypeList.Type.${i + 1}`] = ReportTypeList[i]
		}
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Currently this operation can never be called because the GetReportScheduleList operation cannot return more than 100 results. It is included for future compatibility.
	 * @function getReportScheduleListByNextToken
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportScheduleListByNextToken API reference}
	 */
	getReportScheduleListByNextToken() {
		return 'Currently this operation can never be called because the GetReportScheduleList operation cannot return more than 100 results. It is included for future compatibility.'
	}

	/**
	 * @summary Returns a count of order report requests that are scheduled to be submitted to Amazon MWS.
	 * @description The GetReportScheduleCount operation returns a count of report requests that are scheduled to be submitted to Amazon MWS. Only Order Reports can be scheduled.
	 * @async
	 * @function getReportScheduleCount
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_GetReportScheduleCount.html API reference}
	 * @param {[string]} [ReportTypeList] A structured list of {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_ReportType.html ReportType} enumeration values.
	 * @returns {object} A non-negative integer indicating the number of matching report requests that are scheduled.
	 */
	async getReportScheduleCount(ReportTypeList) {
		const action = this.getActionName()
		const params = {}
		if (ReportTypeList) params.ReportTypeList = ReportTypeList

		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Updates the acknowledged status of one or more reports.
	 * @description The UpdateReportAcknowledgements operation is an optional request that updates the acknowledged status of one or more reports. Use this operation if you want Amazon MWS to remember the acknowledged status of your reports. To keep track of which reports you have already received, it is a good practice to acknowledge reports after you have received and stored them successfully. Then, when you submit a GetReportList request, you can specify to receive only reports that have not yet been acknowledged.
	 * <p>To retrieve reports that have been lost, set the Acknowledged to false and then submit a GetReportList request. This action returns a list of all reports within the previous 90 days that match the query parameters.</p>
	 * <p><b>Note:</b> When submitting the GetReportList or GetReportListByNextToken operations, be sure that HasNext returns false before submitting the UpdateReportAcknowledgements operation. This helps to ensure that all of the reports that match your query parameters are returned.</p>
	 * @async
	 * @function updateReportAcknowledgements
	 * {@link https://docs.developer.amazonservices.com/en_US/reports/Reports_UpdateReportAcknowledgements.html API reference}
	 * @param {[string]} [ReportIdList] A structured list of Report Ids. The maximum number of reports that can be specified is 100.
	 * @param {boolean} [Acknowledged] A Boolean value that indicates that you have received and stored a report. Specify true to set the acknowledged status of a report to true. Specify false to set the acknowledged status of a report to false.
	 * @returns {object} The response elements that the UpdateReportAcknowledgements operation returns
	 */
	async updateReportAcknowledgements(ReportIdList = [], Acknowledged = undefined) {
		const action = this.getActionName()
		const params = {}

		if (Acknowledged) params.Acknowledged = Acknowledged

		for (let i = 0; i < ReportIdList.length; i += 1) {
			params[`ReportIdList.Id.${i + 1}`] = ReportIdList[i]
		}
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}
}

module.exports = Reports
