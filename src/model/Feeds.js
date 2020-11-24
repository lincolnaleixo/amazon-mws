const crypto = require('crypto')
const { runInThisContext } = require('vm')
const DefaultApi = require('../api/DefaultApi')

// TODO return types
// TODO add throttling
// TODO params object types definition
// TODO marketplaceid aceitando por country code
// TODO implement wait for necessary methods. Eg submitFeed getFeedSubmissionResult

/**
 * @summary Feeds API implementation
 * @description The Amazon MWS Feeds API section of the Amazon Marketplace Web Service (Amazon MWS) API lets you upload inventory and order data to Amazon. You can also use the Amazon MWS Feeds API section to get information about the processing of feeds.
 * @class Feeds
 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_Overview.html API reference}
 */
class Feeds extends DefaultApi {

	/**
	 * @param {Credentials} credentials Credentials to be used on the API
	 * @param {('BR' | 'CA' | 'MX' | 'US' | 'AE' | 'DE' | 'ES' | 'FR' | 'GB' | 'IT' | 'EG' | 'NL' | 'SA' | 'SE' | 'TR' | 'IN' | 'SG' | 'AU' | 'JP')} marketplaceCountryCode Country code of desired marketplace to be used in API
	 */
	constructor(credentials, marketplaceCountryCode) {
		super(credentials, marketplaceCountryCode, 'Feeds')
	}

	/**
	 * @summary Uploads a feed for processing by Amazon MWS.
	 * @description The SubmitFeed operation uploads a file and any necessary metadata for processing. Note that you must calculate a Content-MD5 value for the submitted file. For more information about creating a Content-MD5 value, see Using the Content-MD5 hash with the SubmitFeed and GetFeedSubmissionResult operations.
	 * <p>Feed size must be below 2 GiB (231, or 2,147,483,648 bytes) per feed. If you have a large amount of data to submit, you should submit feeds smaller than the feed size limit by breaking up the data, or submit the feeds over a period of time. For optimal performance, a good practice is to submit feeds with a size limit of 30,000 records/items, or submit feeds over a period of time, such as every few hours.</p>
	 * @async
	 * @function submitFeed
	 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_SubmitFeed.html API reference}
	 * @param FeedContent The actual content of the feed itself, in XML or flat file format. You must include the FeedContent in the body of the HTTP request.
	 * @param {string} FeedContent The actual content of the feed itself, in XML or flat file format. You must include the FeedContent in the body of the HTTP request.
	 * @param {string} FeedType A FeedType value indicating how the data should be processed.
	 * @param {[string]} [MarketplaceIdList] A list of one or more marketplace IDs (of marketplaces you are registered to sell in) that you want the feed to be applied to. The feed will be applied to all the marketplaces you specify.
	 * @param {boolean} [PurgeAndReplace] A Boolean value that enables the purge and replace functionality. Set to true to purge and replace the existing data; otherwise false. This value only applies to product-related flat file feed types, which do not have a mechanism for specifying purge and replace in the feed body. Use this parameter only in exceptional cases. Usage is throttled to allow only one purge and replace within a 24-hour period.
	 * @param {string} [AmazonOrderId] An Amazon-defined order identifier. Used to identify an Amazon Easy Ship order that you want to get PDF documents for. This functionality is available only in the India marketplace. See How to get invoice, shipping label, and warranty documents.
	 * @param {('ShippingLabel' | 'Invoice' | 'Warranty')} [DocumentType] The type of PDF document that you want to get for the Amazon Easy Ship order identified with the AmazonOrderId parameter. This functionality is available only in the India marketplace.
	 * @returns {object} Detailed information about a feed submission.
	 */
	async submitFeed(
		FeedContent, FeedType, MarketplaceIdList,
		PurgeAndReplace, AmazonOrderId, DocumentType,
	) {
		const action = this.getActionName()
		const params = { FeedType }
		const headers = {}
		for (let i = 0; i < MarketplaceIdList.length; i += 1) params[`MarketplaceIdList.Id.${i + 1}`] = MarketplaceIdList[i]
		if (PurgeAndReplace) params.PurgeAndReplace = PurgeAndReplace
		if (AmazonOrderId) params.AmazonOrderId = AmazonOrderId
		if (DocumentType) params.DocumentType = DocumentType

		const contentHash = crypto.createHash('md5').update(FeedContent)
			.digest('base64')
		params.ContentMD5Value = contentHash
		headers['Content-MD5'] = contentHash


		const response = await this.request({
			Action: action,
			Params: params,
			Data: FeedContent,
			Headers: headers,
		})

		return response[`${action}Response`][`${action}Result`].FeedSubmissionInfo
	}

	/**
	 * @summary Uploads a feed for processing by Amazon MWS.
	 * @description <p>The GetFeedSubmissionList operation returns a list of feed submissions submitted in the previous 90 days that match the query parameters. Use this operation to determine the status of a feed submission by passing in the FeedProcessingId that was returned by the SubmitFeed operation.</p>
	 * <p>The GetFeedSubmissionList request can return a maximum of 100 results. If there are additional results to return, HasNext is returned in the response with a true value. To retrieve all the results, you can pass the value of the NextToken parameter to the GetFeedSubmissionListByNextToken operation and repeat until HasNext is false.</p>
	 * @async
	 * @function getFeedSubmissionList
	 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_GetFeedSubmissionList.html API reference}
	 * @param {string[]} [FeedSubmissionIdList] The actual content of the feed itself, in XML or flat file format. You must include the FeedContent in the body of the HTTP request.
	 * @param {int} [MaxCount=10] A non-negative integer that indicates the maximum number of feed submissions to return in the list. If you specify a number greater than 100, the request is rejected.
	 * @param {[string]} [FeedTypeList] A structured list of one or more FeedType values by which to filter the list of feed submissions.
	 * @param {[string]} [FeedProcessingStatusList] A structured list of one or more feed processing statuses by which to filter the list of feed submissions.
	 * @param {date} [SubmittedFromDate] The earliest submission date that you are looking for, in ISO8601 date format.
	 * @param {date} [SubmittedToDate] The latest submission date that you are looking for, in ISO8601 date format.
	 * @returns {object} Detailed information about getFeedSubmissionList
	 */
	async getFeedSubmissionList(
		FeedSubmissionIdList = [], MaxCount = 10, FeedTypeList = [],
		FeedProcessingStatusList = [], SubmittedFromDate, SubmittedToDate,
	) {
		const action = this.getActionName()
		const params = { MaxCount }
		for (let i = 0; i < FeedSubmissionIdList.length; i += 1) params[`FeedSubmissionIdList.Id.${i + 1}`] = FeedSubmissionIdList[i]
		for (let i = 0; i < FeedTypeList.length; i += 1) params[`FeedTypeList.Type.${i + 1}`] = FeedTypeList[i]
		for (let i = 0; i < FeedProcessingStatusList.length; i += 1) params[`FeedProcessingStatusList.Status.${i + 1}`] = FeedProcessingStatusList[i]
		if (SubmittedFromDate) params.SubmittedFromDate = SubmittedFromDate
		if (SubmittedToDate) params.SubmittedToDate = SubmittedToDate

		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a list of feed submissions using the NextToken parameter.
	 * @description The GetFeedSubmissionListByNextToken operation returns a list of feed submissions that match the query parameters. It uses the NextToken, which was supplied in a previous request to either the GetFeedSubmissionListByNextToken operation or the GetFeedSubmissionList operation where the value of HasNext was true.
	 * @async
	 * @function getFeedSubmissionListByNextToken
	 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_GetFeedSubmissionListByNextToken.html API reference}
	 * @param {string} NextToken A string token returned by a previous request to either GetFeedSubmissionList or GetFeedSubmission ListByNextToken where the value of HasNext was true.
	 * @returns {object} Detailed information about getFeedSubmissionListByNextToken
	 */
	async getFeedSubmissionListByNextToken(NextToken) {
		const action = this.getActionName()
		const params = { NextToken }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns a count of the feeds submitted in the previous 90 days.
	 * @description The GetFeedSubmissionCount operation returns a count of the total number of feeds submitted in the previous 90 days.
	 * @async
	 * @function getFeedSubmissionCount
	 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_GetFeedSubmissionCount.html API reference}
	 * @param {[string]} [FeedTypeList] A structured list of one or more FeedType values by which to filter the list of feed submissions.
	 * @param {[('_AWAITING_ASYNCHRONOUS_REPLY_' | '_CANCELLED_')]} [FeedProcessingStatusList] A structured list of one or more feed processing statuses by which to filter the list of feed submissions.
	 * @param {date} [SubmittedFromDate] The earliest submission date that you are looking for, in ISO8601 date format.
	 * @param {date} [SubmittedToDate] The latest submission date that you are looking for, in ISO8601 date format.
	 * @returns {object} The total number of feed submissions that match the request parameters.
	 */
	async getFeedSubmissionCount(FeedTypeList = [], FeedProcessingStatusList = [],
		SubmittedFromDate, SubmittedToDate) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < FeedTypeList.length; i += 1) params[`FeedTypeList.Type.${i + 1}`] = FeedTypeList[i]
		for (let i = 0; i < FeedProcessingStatusList.length; i += 1) params[`FeedProcessingStatusList.Status.${i + 1}`] = FeedProcessingStatusList[i]
		if (SubmittedFromDate) params.SubmittedFromDate = SubmittedFromDate
		if (SubmittedToDate) params.SubmittedToDate = SubmittedToDate
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Cancels one or more feed submissions and returns a count of the feed submissions that were canceled.
	 * @description The CancelFeedSubmissions operation cancels one or more feed submissions and returns a count of the canceled feed submissions and the feed submission information. Note that if you do not specify a FeedSubmmissionId, all feed submissions are canceled.
	 * <p>Information is returned for the first 100 feed submissions in the list. To return information for more than 100 canceled feed submissions, use the GetFeedSubmissionList operation.</p>
	 * <p>If a feed has begun processing, it cannot be canceled.</p>
	 * @async
	 * @function cancelFeedSubmissions
	 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_CancelFeedSubmissions.html API reference}
	 * @param {[string]} [FeedSubmissionIdList] A structured list of FeedSubmmissionId values. If you pass in FeedSubmmissionId values in a request, other query conditions are ignored.
	 * @param {[string]} [FeedTypeList] A structured list of one or more FeedType values by which to filter the list of feed submissions.
	 * @param {date} [SubmittedFromDate] The earliest submission date that you are looking for, in ISO8601 date format.
	 * @param {date} [SubmittedToDate] The latest submission date that you are looking for, in ISO8601 date format.
	 * @returns {object} Detailed information about a feed that was canceled.
	 */
	async cancelFeedSubmissions(FeedTypeList = [], FeedSubmissionIdList = [],
		SubmittedFromDate, SubmittedToDate) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < FeedTypeList.length; i += 1) params[`FeedTypeList.Type.${i + 1}`] = FeedTypeList[i]
		for (let i = 0; i < FeedSubmissionIdList.length; i += 1) params[`FeedSubmissionIdList.Id.${i + 1}`] = FeedSubmissionIdList[i]
		if (SubmittedFromDate) params.SubmittedFromDate = SubmittedFromDate
		if (SubmittedToDate) params.SubmittedToDate = SubmittedToDate
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the feed processing report and the Content-MD5 header.
	 * @description The GetFeedSubmissionResult operation returns the feed processing report and the Content-MD5 header for the returned HTTP body.
	 * <p>You should compute the MD5 hash of the HTTP body of the report that Amazon MWS returned to you, and compare that with the Content-MD5 header value that is returned. If the computed hash value and the returned hash value do not match, the report body was corrupted during transmission. You should discard the result and automatically retry the request for up to three more times. Please notify Amazon MWS if you receive a corrupted report body. For more information on the Content-MD5 header, see Using the Content-MD5 hash with the SubmitFeed and GetFeedSubmissionResult operations.</p>
	 * @async
	 * @function getFeedSubmissionResult
	 * {@link https://docs.developer.amazonservices.com/en_US/feeds/Feeds_GetFeedSubmissionResult.html API reference}
	 * @param {string} FeedSubmissionId The identifier of the feed submission you are requesting a feed processing report for. You can get the FeedSubmissionId for a feed using the GetFeedSubmissionList operation.
	 * @returns {object} The GetFeedSubmissionResult operation returns the feed processing report and the Content-MD5 header for the returned HTTP body.
	 */
	async getFeedSubmissionResult(FeedSubmissionId) {
		const action = this.getActionName()
		const params = { FeedSubmissionId }

		return await this.request({
			Action: action,
			Params: params,
		})
	}

}

module.exports = Feeds
