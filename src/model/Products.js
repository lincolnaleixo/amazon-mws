const DefaultApi = require('../api/DefaultApi')

// TODO return types
// TODO add throttling
// TODO params object types definition
// TODO marketplaceid aceitando por country code
// TODO implement wait for necessary methods.

/**
 * @summary Products API implementation
 * @description The Products API section of Amazon Marketplace Web Service (Amazon MWS) helps you get information to match your products to existing product listings on Amazon Marketplace websites and to make sourcing and pricing decisions for listing those products on Amazon Marketplace websites. The Amazon MWS Products API returns product attributes, current Marketplace pricing information, and a variety of other product and listing information.
 * @class Products
 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_Overview.html API reference}
 */
class Products extends DefaultApi {

	/**
	 * @param {Credentials} credentials Credentials to be used on the API
	 * @param {('BR' | 'CA' | 'MX' | 'US' | 'AE' | 'DE' | 'ES' | 'FR' | 'GB' | 'IT' | 'EG' | 'NL' | 'SA' | 'SE' | 'TR' | 'IN' | 'SG' | 'AU' | 'JP')} marketplaceCountryCode Country code of desired marketplace to be used in API
	 */
	constructor(credentials, marketplaceCountryCode) {
		super(credentials, marketplaceCountryCode, 'Products')
	}

	/**
	 * @summary Returns a list of products and their attributes, based on a search query.
	 * @description The ListMatchingProducts operation returns a list of products and their attributes, ordered by relevancy, based on a search query that you specify. Your search query can be a phrase that describes the product or it can be a product identifier such as a GCID, UPC, EAN, ISBN, or JAN. If you have the ASIN associated with your product, use the GetMatchingProduct operation. Note that the product identifier cannot be a SellerSKU. If your query does not return any matching products, the query will be broadened using spelling correction or the removal of keywords to find matches. This operation returns a maximum of ten products and does not return non-buyable products.
	 * @async
	 * @function listMatchingProducts
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_ListMatchingProducts.html API reference}
	 * @param {string} query A search string with the same support as that provided on Amazon marketplace websites.
	 * @param {string} [queryContextId=undefined]	An identifier for the context within which the given search will be performed. A marketplace might provide mechanisms for constraining a search to a subset of potential items. For example, the Amazon retail marketplace allows queries to be constrained to a specific category. The QueryContextId parameter specifies such a sub-set. If it is omitted, the search will be performed using the default context for the marketplace, which will typically contain the largest set of items.
	 * @returns {object} response The response elements that the ListMatchingProducts operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async listMatchingProducts(query, queryContextId = undefined) {
		const params = { Query: query }
		if (queryContextId) params.QueryContextId = queryContextId
		const response = await this.request({
			Api: this.api,
			Action: 'ListMatchingProducts',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns a list of products and their attributes, based on a list of ASIN values.
	 * @description The GetMatchingProduct operation returns a list of products and their attributes, based on a list of ASIN values that you specify. This operation returns a maximum of ten products. <b>Important:</b> All of the functionality of the GetMatchingProduct operation can be found in the new GetMatchingProductForId operation. The GetMatchingProduct operation is included in the Products API section for backward compatibility, but you should use the GetMatchingProductForId operation in favor of the GetMatchingProduct operation whenever possible. For more information, see GetMatchingProductForId.
	 * @async
	 * @function getMatchingProduct
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetMatchingProduct.html API reference}
	 * @param {[string]} ASINList A structured list of ASIN values. Used to identify products in the given marketplace. Maximum: 10 ASIN values
	 * @returns {object} response The response elements that the GetMatchingProduct operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getMatchingProduct(ASINList) {
		const params = { }
		for (let i = 0; i < ASINList.length; i += 1) {
			params[`ASINList.ASIN.${i + 1}`] = ASINList[i]
		}
		const response = await this.request({
			Api: this.api,
			Action: 'GetMatchingProduct',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns a list of products and their attributes, based on a list of ASIN, GCID, SellerSKU, UPC, EAN, ISBN, and JAN values.
	 * @description The GetMatchingProductForId operation returns a list of products and their attributes, based on a list of product identifier values that you specify. Possible product identifiers are ASIN, GCID, SellerSKU, UPC, EAN, ISBN, and JAN.
	 * @async
	 * @function getMatchingProductForId
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetMatchingProductForId.html API reference}
	 * @param {('ASIN' | 'GCID' | 'SellerSKU' | 'UPC' | 'EAN' | 'ISBN' | 'JAN' )} IdType The type of product identifier that Id values refer to.
	 * @param {[string]} IdList A structured list of Id values. Used to identify products in the given marketplace.
	 * @returns {object} response The response elements that the GetMatchingProductForId operation returns. Maximum: Five Id values
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getMatchingProductForId(IdType, IdList) {
		const params = { IdType }
		for (let i = 0; i < IdList.length; i += 1) {
			params[`IdList.Id.${i + 1}`] = IdList[i]
		}
		const response = await this.request({
			Api: this.api,
			Action: 'GetMatchingProductForId',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns the current competitive price of a product, based on SellerSKU.
	 * @description The GetCompetitivePricingForSKU operation returns the current competitive pricing of a product, based on the SellerSKU and MarketplaceId that you specify. Note that SellerSKU is qualified by your SellerId, which is included with every Amazon Marketplace Web Service (Amazon MWS) operation that you submit. This operation returns pricing for active offer listings based on two pricing models: New Buy Box Price and Used Buy Box Price. These pricing models are equivalent to the main Buy Box Price and the subordinate Buy Box Price, respectively, on a detail page from an Amazon marketplace website. Note that products with active offer listings might not return either of these prices. This could happen, for example, if none of the sellers with offer listings for a product are qualified for the New Buy Box or the Used Buy Box. Also note that your own price for the SellerSKU that you specify is not excluded from the response, so your price will be returned if it is the lowest listed price. The number of offer listings, the trade-in value, and the sales rankings for the SellerSKU that you specify are also returned. <p><b>Note</b>: If you specify a SellerSKU that identifies a variation parent ASIN, this operation returns an error. A variation parent ASIN represents a generic product that cannot be sold. Variation child ASINs represent products that have specific characteristics (such as size and color) and can be sold.</p>
	 * @async
	 * @function getCompetitivePricingForSKU
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetCompetitivePricingForSKU.html API reference}
	 * @param {[string]} SellerSKUList A structured list of SellerSKU values. Used to identify products in the given marketplace. SellerSKU is qualified by your SellerId, which is included with every Amazon Marketplace Web Service (Amazon MWS) operation that you submit. Maximum: 20 SellerSKU values
	 * @returns {object} The response elements that the GetCompetitivePricingForSKU operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getCompetitivePricingForSKU(SellerSKUList) {
		const params = { }
		for (let i = 0; i < SellerSKUList.length; i += 1) {
			params[`SellerSKUList.SellerSKU.${i + 1}`] = SellerSKUList[i]
		}
		const response = await this.request({
			Api: this.api,
			Action: 'GetCompetitivePricingForSKU',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns the current competitive price of a product, based on ASIN.
	 * @description The GetCompetitivePricingForASIN operation is the same as the GetCompetitivePricingForSKU operation, except that it uses a MarketplaceId and an ASIN to uniquely identify a product, and it does not return the SKUIdentifier element. If you do not have the ASIN for a product, you will first have to submit the ListMatchingProducts operation for disambiguation.
	 * @async
	 * @function getCompetitivePricingForASIN
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetCompetitivePricingForASIN.html API reference}
	 * @param {[string]} ASINList A structured list of ASIN values. Used to identify products in the given marketplace. Maximum: 20 ASIN values
	 * @returns {object} The response elements that the GetCompetitivePricingForASIN operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getCompetitivePricingForASIN(ASINList) {
		const params = { }
		for (let i = 0; i < ASINList.length; i += 1) {
			params[`ASINList.ASIN.${i + 1}`] = ASINList[i]
		}
		const response = await this.request({
			Api: this.api,
			Action: 'GetCompetitivePricingForASIN',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns pricing information for the lowest-price active offer listings for up to 20 products, based on SellerSKU.
	 * @description <p class="p">The GetLowestOfferListingsForSKU operation returns the lowest price offer listings for a specific product by item condition. The listings for the specified product and
   ItemCondition are placed in offer listing groups, each group representing a different combination of the following six qualifiers: </p>
	 <ul class="ul">
	 	<li class="li">ItemCondition (New, Used, Collectible, Refurbished, or Club) </li>
		<li class="li">ItemSubcondition (New, Mint, Very Good, Good, Acceptable, Poor, Club, OEM, Warranty, Refurbished Warranty, Refurbished, Open Box, or Other) </li>
		<li class="li">FulfillmentChannel (Amazon or Merchant) </li>
		<li class="li">ShipsDomestically (True, False, or Unknown) – Indicates whether the marketplace specified in the request and the location that the item ships from are in the same country. </li>
		<li class="li">ShippingTime (0-2 days, 3-7 days, 8-13 days, or 14 or more days) – Indicates the maximum time within which the item will likely be shipped once an order has been placed </li>
		<li class="li">SellerPositiveFeedbackRating (98-100%, 95-97%, 90-94%, 80-89%, 70-79%, Less than 70%, or Just launched ) – Indicates the percentage of feedback ratings that were positive over the past 12 months. </li>
	 </ul>
	 <p class="p">Some (but not necessarily all) of the active offer listings for the specified product and ItemCondition, initially sorted by the lowest landed price, are placed into their corresponding offer listing groups, and the listing with the lowest landed price from each group is returned. If multiple sellers have listings that share the lowest landed price for a group, the listing from the seller with the highest feedback count is returned. Groups without any listings are not returned. </p>
	 <p class="p">This operation returns the AllOfferListingsConsidered response element, which indicates whether or not all of the active offe listings for the specified product and ItemCondition were considered when the listings were placed into their corresponding offer listing groups. Note that even if not all the listings were considered, you can still expect the following: </p>
	 <ul class="ul">
	 	<li class="li">The lowest landed prices that are returned will be the lowest landed prices from their respective offer listing groups. </li>
	 	<li class="li">The lowest landed prices that are returned will be lower than the landed prices for any listings that were not considered. </li>
	 </ul>
	 <p><b>Note:</b> When you submit the GetLowestOfferListingsForSKU operation, your own offer listings are included in the response unless you use the ExcludeMe request parameter with a value of True.</p>
	 <p><b>Note:</b> Instead of calling the GetLowestOfferListingsForSKU operation to obtain the lowest price offer listings for a specific product by item condition, consider calling the GetLowestPricedOffersForSKU operation.</p>
	 <p> You can also subscribe to the AnyOfferChanged notification by using the Subscriptions API service. When you subscribe to this notification, you will be notified whenever there is a price change or offer listing change for any of the top 20 offers, by condition (new or used), for an item that you sell.</p>
	 * @async
	 * @function getLowestOfferListingsForSKU
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetLowestOfferListingsForSKU.html API reference}
	 * @param {[string]} SellerSKUList A structured list of ASIN values. Used to identify products in the given marketplace. Maximum: 20 ASIN values
	 * @param {('Any' | 'New' | 'Used', 'Collectible' | 'Refurbished' | 'Club')} [ItemCondition='Any'] Filters the offer listings to be considered based on item condition.
	 * @returns {object} The GetLowestOfferListingsForSKU operation returns the Product response element
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getLowestOfferListingsForSKU(SellerSKUList, ItemCondition = 'Any') {
		const params = { ItemCondition }
		for (let i = 0; i < SellerSKUList.length; i += 1) {
			params[`SellerSKUList.SellerSKU.${i + 1}`] = SellerSKUList[i]
		}
		const response = await this.request({
			Api: this.api,
			Action: 'GetLowestOfferListingsForSKU',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns pricing information for the lowest-price active offer listings for up to 20 products, based on ASIN.
	 * @description The GetLowestOfferListingsForASIN operation is the same as the GetLowestOfferListingsForSKU operation except that it uses a MarketplaceId and an ASIN to uniquely identify a product, and it does not return the SKUIdentifier element.
	 * <p><b>Note:</b> Instead of calling the GetLowestOfferListingsForASIN operation to obtain the lowest price offer listings for a specific product by item condition, consider calling the GetLowestPricedOffersForASIN operation.</p>
	 * <p>You can also subscribe to the AnyOfferChanged notification by using the Subscriptions API service. When you subscribe to this notification, you will be notified whenever there is a price change or offer listing change for any of the top 20 offers, by condition (new or used), for an item that you sell.</p>
	 * @async
	 * @function getLowestOfferListingsForASIN
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetLowestOfferListingsForASIN.html API reference}
	 * @param {[string]} ASINList A structured list of ASIN values. Used to identify products in the given marketplace. Maximum: 20 ASIN values
	 * @param {('Any' | 'New' | 'Used', 'Collectible' | 'Refurbished' | 'Club')} [ItemCondition='Any'] Filters the offer listings to be considered based on item condition.
	 * @returns {object} The response elements that the GetLowestOfferListingsForASIN operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getLowestOfferListingsForASIN(ASINList, ItemCondition = 'Any') {
		const params = { ItemCondition }
		for (let i = 0; i < ASINList.length; i += 1) {
			params[`ASINList.ASIN.${i + 1}`] = ASINList[i]
		}
		const response = await this.request({
			Api: this.api,
			Action: 'GetLowestOfferListingsForASIN',
			Params: params,
		})

		return response
	}

	/**
	 * @summary Returns lowest priced offers for a single product, based on SellerSKU.
	 * @description The GetLowestPricedOffersForSKU operation returns the top 20 offers for a given MarketplaceId, SellerSKU, and ItemCondition that you specify. The top 20 offers are determined by the lowest landed price, which is the price plus shipping minus Amazon Points. If multiple sellers are charging the same landed price, the results will be returned in random order.
	 * <p><b style="font-size:12px">Pricing Models:</b></p>
	 * <p>This operation returns pricing for active offer listings based on two pricing models: New Buy Box Price and Used Buy Box Price. These pricing models are equivalent to the main Buy Box Price and the subordinate Buy Box Price, respectively, on a detail page from an Amazon marketplace website. Products with active offer listings might not return either of these prices. This could happen, for example, if none of the sellers with offer listings for a product are qualified for the New Buy Box or the Used Buy Box. Your own price for the SellerSKU that you specify is not excluded from the response, so your price will be returned if it is among the lowest listed prices. The number of offer listings, the trade-in value, and the sales rankings for the SellerSKU that you specify are also returned.</p>
	 * @async
	 * @function getLowestPricedOffersForSKU
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetLowestPricedOffersForSKU.html API reference}
	 * @param {string} SellerSKU The SellerSKU that identifies the product to query.
	 * @param {('New' | 'Used' | 'Collectible' | 'Refurbished' | 'Club')} ItemCondition Filters the offer listings to be considered based on item condition.
	 * @returns {object} The response elements that the GetLowestPricedOffersForSKU operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/default.xsd Response default schema}
	 */
	async getLowestPricedOffersForSKU(SellerSKU, ItemCondition) {
		const action = this.getActionName()
		const params = {
			ItemCondition, SellerSKU,
		}
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns lowest priced offers for a single product, based on ASIN.
	 * @description The GetLowestPricedOffersForASIN operation is the same as the GetLowestPricedOffersForSKU operation, except that it uses a MarketplaceId and an ASIN to uniquely identify a product, and it does not return the MyOffer element. If you do not have the ASIN for a product, you can use the ListMatchingProducts operation to search for the ASIN.
	 * @async
	 * @function getLowestPricedOffersForASIN
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetLowestPricedOffersForASIN.html API reference}
	 * @param {string} ASIN The Amazon Standard Identification Number (ASIN) of the item.
	 * @param {('New' | 'Used' | 'Collectible' | 'Refurbished' | 'Club')} ItemCondition Filters the offer listings to be considered based on item condition.
	 * @returns {object} The response elements that the GetLowestPricedOffersForASIN operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 */
	async getLowestPricedOffersForASIN(ASIN, ItemCondition) {
		const action = this.getActionName()
		const response = await this.request({
			Action: action,
			Params: {
				ASIN, ItemCondition,
			},
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the estimated fees for a list of products.
	 * @description The GetMyFeesEstimate operation takes a list of products and marketplaces returns the fees for those products in those marketplaces. You can call GetMyFeesEstimate for a set of products before setting prices on those products. Your prices can then take estimated fees into account. You must specify your products by ASIN or SKU (not UPC, ISBN, etc). With each product fees request, you must include an original identifier. This identifier is included in the fees estimate so you can correlate a fees estimate with an original request. This operation allows up to 20 product requests in a single batch. For more information on processing the result, see Processing bulk operation requests.
	 * <p><b>Note</b>: The estimated fees returned by this API are not guaranteed. Actual fees may vary.</p>
	 * <p>For more information on fees, see Selling on Amazon Fee Schedule and FBA features and fees on Seller Central.</p>
	 * @async
	 * @function getMyFeesEstimate
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetMyFeesEstimate.html API reference}
	 * @param {[object]} FeesEstimateRequestList A list of products, marketplaces, and other options to query for fees. Maximum: 20 requests.
	 * @returns {object} Amazon MWS returns an XML file that contains the response to a successful request or subscription. If the request is unsuccessful, the main response element is ErrorResponse. For more information, see Response format in the Amazon MWS Developer Guide. The response elements that the GetMyFeesEstimate operation returns.
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 */
	async getMyFeesEstimate(FeesEstimateRequestList) {
		const action = this.getActionName()
		const params = { }
		for (let i = 0; i < FeesEstimateRequestList.length; i += 1) {
			const requestItems = FeesEstimateRequestList[i]
			for (const requestItemsKey in requestItems) {
				params[`FeesEstimateRequestList.FeesEstimateRequest.${i + 1}.${requestItemsKey}`] = requestItems[requestItemsKey]
			}
			params[`FeesEstimateRequestList.FeesEstimateRequest.${i + 1}.Identifier`] = `request${i + 1}`
			params[`FeesEstimateRequestList.FeesEstimateRequest.${i + 1}.MarketplaceId`] = this.marketplace.id
		}
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns pricing information for your own active offer listings, based on SellerSKU.
	 * @description The GetMyPriceForSKU operation returns pricing information for your own active offer listings, based on the ASIN mapped to the SellerSKU and MarketplaceId that you specify. Note that if you submit a SellerSKU for a product for which you don’t have an active offer listing, the operation returns an empty Offers element. This operation returns pricing information for a maximum of 20 offer listings.
	 * @async
	 * @function getMyPriceForSKU
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetMyPriceForSKU.html API reference}
	 * @param {[string]} SellerSKUList A structured list of SellerSKU values. Used to identify products in the given marketplace. SellerSKU is qualified by your SellerId, which is included with every Amazon Marketplace Web Service (Amazon MWS) operation that you submit. Maximum: 20 SellerSKU values
	 * @param {('New' | 'Used' | 'Collectible' | 'Refurbished' | 'Club')} ItemCondition Filters the offer listings to be considered based on item condition.
	 * @returns {object} The response elements that the GetMyPriceForSKU operation returns
	 */
	async getMyPriceForSKU(SellerSKUList, ItemCondition) {
		const action = this.getActionName()
		const params = { ItemCondition }
		for (let i = 0; i < SellerSKUList.length; i += 1) {
			params[`SellerSKUList.SellerSKU.${i + 1}`] = SellerSKUList[i]
		}

		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns pricing information for your own active offer listings, based on ASIN.
	 * @description The GetMyPriceForASIN operation is the same as the GetMyPriceForSKU operation except that it uses a MarketplaceId and an ASIN to uniquely identify a product, and it does not return the SKUIdentifier element.
	 * @async
	 * @function getMyPriceForASIN
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetMyPriceForASIN.html API reference}
	 * @param {[string]} ASINList A structured list of ASIN values. Used to identify products in the given marketplace. Maximum: 20 ASIN values.
	 * @param {('All' | 'New' | 'Used' | 'Collectible' | 'Refurbished' | 'Club')} ItemCondition Filters the offer listings to be considered based on item condition.
	 * @returns {object} The response elements that the GetMyPriceForASIN operation returns
	 * {@link http://g-ecx.images-amazon.com/images/G/01/mwsportal/doc/en_US/products/ProductsAPI_Response.xsd Response schema ProductsAPI}
	 */
	async getMyPriceForASIN(ASINList, ItemCondition) {
		const action = this.getActionName()
		const params = { ItemCondition }
		for (let i = 0; i < ASINList.length; i += 1) {
			params[`ASINList.ASIN.${i + 1}`] = ASINList[i]
		}

		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the parent product categories that a product belongs to, based on SellerSKU.
	 * @description The GetProductCategoriesForSKU operation returns the product category name and identifier that a product belongs to, including parent categories back to the root for the marketplace.
	 * @async
	 * @function getProductCategoriesForSKU
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetProductCategoriesForSKU.html API reference}
	 * @param {string} SellerSKU Used to identify products in the given marketplace. SellerSKU is qualified by your SellerId, which is included with every Amazon Marketplace Web Service (Amazon MWS) operation that you submit.
	 * @returns {object} The response elements that the GetProductCategoriesForSKU operation returns
	 */
	async getProductCategoriesForSKU(SellerSKU) {
		const action = this.getActionName()
		const params = { SellerSKU }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the parent product categories that a product belongs to, based on ASIN.
	 * @description The GetProductCategoriesForASIN operation is the same as the GetProductCategoriesForSKU operation except that it uses a MarketplaceId and an ASIN to uniquely identify a product.
	 * @async
	 * @function getProductCategoriesForASIN
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetProductCategoriesForASIN.html API reference}
	 * @param {string} ASIN Identifies the product in given the Marketplace.
	 * @returns {object} The response elements that the GetProductCategoriesForASIN operation returns
	 */
	async getProductCategoriesForASIN(ASIN) {
		const action = this.getActionName()
		const params = { ASIN }
		const response = await this.request({
			Action: action,
			Params: params,
		})

		return response[`${action}Response`][`${action}Result`]
	}

	/**
	 * @summary Returns the operational status of the Products API section.
	 * @description <p>The GetServiceStatus operation returns the operational status of the Products API section of Amazon Marketplace Web Service (Amazon MWS). Status values are GREEN, YELLOW, and RED.</p>
	 * <p>The GetServiceStatus operation has a maximum request quota of two and a restore rate of one request every five minutes. For definitions of throttling terminology, see Throttling in the Products API.</p>
	 * @async
	 * @function getServiceStatus
	 * {@link https://docs.developer.amazonservices.com/en_US/products/Products_GetServiceStatus.html API reference}
	 * @returns {object} The response elements that the GetServiceStatus operation returns
	 */
	async getServiceStatus() {
		const action = this.getActionName()
		const response = await this.request({ Action: action })

		return response[`${action}Response`][`${action}Result`]
	}

}

module.exports = Products
