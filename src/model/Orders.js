const DefaultApi = require('../api/DefaultApi')

// TODO return types
// TODO add throttling
// TODO params object types definition
// TODO marketplaceid aceitando por country code
// TODO implement wait for necessary methods.

/**
 * @summary Orders API implementation
 * @description With the Orders API section of Amazon Marketplace Web Service (Amazon MWS), you can build simple applications that retrieve only the order information that you need. This enables you to develop fast, flexible, custom applications in areas like order synchronization, order research, and demand-based decision support tools.
 * <p>The Orders API section is optimized for data synchronization, retrieving order updates in real-time, and order research. For bulk order data reporting, you should create order reports with the Reports API section. For more information about the Reports API section, see the Reports API section documentation.</p>
 * @class Orders
 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_Overview.html API reference}
 */
class Orders extends DefaultApi {

	/**
	 * @param {Credentials} credentials Credentials to be used on the API
	 * @param {('BR' | 'CA' | 'MX' | 'US' | 'AE' | 'DE' | 'ES' | 'FR' | 'GB' | 'IT' | 'EG' | 'NL' | 'SA' | 'SE' | 'TR' | 'IN' | 'SG' | 'AU' | 'JP')} marketplaceCountryCode Country code of desired marketplace to be used in API
	 */
	constructor(credentials, marketplaceCountryCode) {
		super(credentials, marketplaceCountryCode, 'Orders')
	}

	/**
	 * @summary Returns orders created or updated during a time frame that you specify.
	 * @description The ListOrders operation returns a list of orders created or updated during a time frame that you specify. You define that time frame using the CreatedAfter parameter or the LastUpdatedAfter parameter. You must use one of these parameters, but not both. You can also apply a range of filtering criteria to narrow the list of orders that is returned. The ListOrders operation includes order information for each order returned, including AmazonOrderId, OrderStatus, FulfillmentChannel, and LastUpdateDate.
	 * @async
	 * @function listOrders
	 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_ListOrders.html API reference}
	 * @param {date} CreatedAfter A date used for selecting orders created after (or at) a specified time. <b>Important:</b> Amazon does not guarantee that all orders created after the CreatedAfter date that you specify will be returned. Only orders created after (or on) the specified CreatedAfter date and before (or on) the CreatedBefore date in the response are returned. Always check the CreatedBefore response element to get the exact date range for the orders that are returned.
	 * @param {date} [CreatedBefore] A date used for selecting orders created before (or at) a specified time.
	 * @param {date} [LastUpdatedAfter] A date used for selecting orders that were last updated after (or at) a specified time. An update is defined as any change in order status, including the creation of a new order. Includes updates made by Amazon and by the seller.
	 * @param {date} [LastUpdatedBefore] A date used for selecting orders that were last updated before (or at) a specified time. An update is defined as any change in order status, including the creation of a new order. Includes updates made by Amazon and by the seller.
	 * @param {[('PendingAvailability' | 'Pending' | 'Unshipped' , 'PartiallyShipped' | 'Shipped' | 'Canceled' | 'Unfulfillable')]} [OrderStatus] A list of OrderStatus values. Used to select orders with a current status that matches one of the status values that you specify.
	 * @param {[string]} MarketplaceIdList A list of MarketplaceId values. Used to select orders that were placed in the Marketplaces that you specify.
	 * @param {[('AFN' | 'MFN')]} [FulfillmentChannel='All'] A list that indicates how an order was fulfilled.
	 * @param {['COD' | 'CVS' | 'Other']} [PaymentMethod='All] A list of PaymentMethod values. Used to select orders paid for with the payment methods that you specify.
	 * @param {string} [BuyerEmail='All'] The e-mail address of a buyer. Used to select only the orders that contain the specified e-mail address.
	 * @param {string} [SellerOrderId='All'] An order identifier that is specified by the seller. Not an Amazon order identifier. Used to select only the orders that match a seller-specified order identifier.
	 * @param {int} [MaxResultsPerPage=100] A number that indicates the maximum number of orders that can be returned per page.
	 * @param {[('PendingPickUp' | 'LabelCanceled' | 'PickedUp' | 'PickedUp' | 'Damaged' | 'Delivered' | 'RejectedByBuyer' | 'Undeliverable' | 'ReturnedToSeller' | 'ReturningToSeller' | 'Lost')]} [EasyShipShipmentStatus] A list of EasyShipShipmentStatus values. Used to select Easy Ship orders with current statuses that match the status values that you specify. If EasyShipShipmentStatus is specified, only Amazon Easy Ship orders are returned.
	 * <p>This parameter is valid only in the India marketplace.</p>
	 * @returns {object} The response elements that the ListOrders operation returns
	 */
	async listOrders(
		CreatedAfter, CreatedBefore, LastUpdatedAfter, LastUpdatedBefore,
		OrderStatus = [], MarketplaceIdList = [], FulfillmentChannel = [], PaymentMethod = [], BuyerEmail,
		SellerOrderId, MaxResultsPerPage = 100, EasyShipShipmentStatus = [],
	) {
		const action = this.getActionName()
		const params = {
			CreatedAfter, MaxResultsPerPage, 'MarketplaceId.Id.1': this.marketplace.id,
		}
		if (CreatedBefore) params.CreatedBefore = CreatedBefore
		if (LastUpdatedAfter) params.LastUpdatedAfter = LastUpdatedAfter
		if (LastUpdatedBefore) params.LastUpdatedBefore = LastUpdatedBefore
		for (let i = 0; i < OrderStatus.length; i += 1) params[`OrderStatus.Status.${i + 1}`] = OrderStatus[i]
		for (let i = 0; i < MarketplaceIdList.length; i += 1) params[`MarketplaceIdList.Id.${i + 1}`] = MarketplaceIdList[i]
		for (let i = 0; i < PaymentMethod.length; i += 1) params[`PaymentMethod.Method.${i + 1}`] = PaymentMethod[i]
		if (BuyerEmail) params.BuyerEmail = BuyerEmail
		if (SellerOrderId) params.SellerOrderId = SellerOrderId
		for (let i = 0; i < EasyShipShipmentStatus.length; i += 1) params[`EasyShipShipmentStatus.Status.${i + 1}`] = EasyShipShipmentStatus[i]

		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the next page of orders using the NextToken parameter.
	 * @description The ListOrdersByNextToken operation returns the next page of orders using the NextToken value that was returned by your previous request to either ListOrders or ListOrdersByNextToken. If NextToken is not returned, there are no more pages to return.
	 * @async
	 * @function listOrdersByNextToken
	 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_ListOrdersByNextToken.html API reference}
	 * @param {string} NextToken A string token returned in the response of your previous request to either ListOrders or ListOrdersByNextToken.
	 * @returns {object} The response elements that the ListOrdersByNextToken operation returns
	 */
	async listOrdersByNextToken(NextToken) {
		const action = this.getActionName()
		const params = { NextToken }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns orders based on the AmazonOrderId values that you specify.
	 * @description The GetOrder operation returns an order for each AmazonOrderId that you specify, up to a maximum of 50. The GetOrder operation includes order information for each order returned, including PurchaseDate, OrderStatus, FulfillmentChannel, and LastUpdateDate.
	 * @async
	 * @function getOrder
	 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_GetOrder.html API reference}
	 * @param {[string]} AmazonOrderIdList A list of AmazonOrderId values. An AmazonOrderId is an Amazon-defined order identifier, in 3-7-7 format. Maximum: 50
	 * @returns {object} A list of orders.
	 */
	async getOrder(AmazonOrderIdList) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < AmazonOrderIdList.length; i += 1) params[`AmazonOrderId.Id.${i + 1}`] = AmazonOrderIdList[i]
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns order items based on the AmazonOrderId that you specify.
	 * @description The ListOrderItems operation returns order item information for an AmazonOrderId that you specify. The order item information includes Title, ASIN, SellerSKU, ItemPrice, ShippingPrice, as well as tax and promotion information.
	 * <p>You can retrieve order item information by first using the ListOrders operation to find orders created or updated during a time frame that you specify. An AmazonOrderId is included with each order that is returned. You can then use these AmazonOrderId values with the ListOrderItems operation to get detailed order item information for each order.</p>
	 * <p><b>Note:</b> When an order is in the Pending state (the order has been placed but payment has not been authorized), the ListOrderItems operation does not return information about pricing, taxes, shipping charges, gift wrapping, or promotions for the order items in the order. After an order leaves the Pending state (this occurs when payment has been authorized) and enters the Unshipped, Partially Shipped, or Shipped state, the ListOrderItems operation returns information about pricing, taxes, shipping charges, gift wrapping, and promotions for the order items in the order.</p>
	 * @async
	 * @function getOrder
	 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_ListOrderItems.html API reference}
	 * @param {string} AmazonOrderId A list of AmazonOrderId values. An AmazonOrderId is an Amazon-defined order identifier, in 3-7-7 format. Maximum: 50
	 * @returns {object} A list of orders.
	 */
	async listOrderItems(AmazonOrderId) {
		const action = this.getActionName()
		const params = { AmazonOrderId }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the next page of order items using the NextToken parameter.
	 * @description The ListOrderItemsByNextToken operation returns the next page of order items using the NextToken value that was returned by your previous request to either ListOrderItems or ListOrderItemsByNextToken. If NextToken is not returned, there are no more pages to return.
	 * @async
	 * @function listOrderItemsByNextToken
	 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_ListOrderItemsByNextToken.html API reference}
	 * @param {string} NextToken A string token returned in the response of your previous request to either ListOrderItems or ListOrderItemsByNextToken.
	 * @returns {object} The response elements that the ListOrderItemsByNextToken operation returns
	 */
	async listOrderItemsByNextToken(NextToken) {
		const action = this.getActionName()
		const params = { NextToken }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the operational status of the Orders API section.
	 * @description <p>The GetServiceStatus operation returns the operational status of the Orders API section of Amazon Marketplace Web Service. Status values are GREEN, YELLOW, and RED.</p>
	 * <p>The GetServiceStatus operation has a maximum request quota of two and a restore rate of one request every five minutes. For definitions of throttling terminology, see Orders API.</p>
	 * @async
	 * @function getServiceStatus
	 * {@link https://docs.developer.amazonservices.com/en_US/orders-2013-09-01/MWS_GetServiceStatus.html API reference}
	 * @returns {object} The response elements that the GetServiceStatus operation returns
	 */
	async getServiceStatus() {
		const action = this.getActionName()
		const response = await this.request({ Action: action })

		return response[`${action}Response`][`${action}Result`]
	}

}

module.exports = Orders
