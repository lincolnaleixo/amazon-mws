module.exports = {
	Products: {
		Headers: { 'Content-Type': 'x-www-form-urlencoded' },
		Version: '2011-10-01',
	},
	Reports: {
		Headers: { 'Content-Type': 'x-www-form-urlencoded' },
		Version: '2009-01-01',
	},
	Orders: {
		Headers: { 'Content-Type': 'text/xml' },
		Version: '2013-09-01',
	},
	Feeds: {
		Headers: { 'Content-Type': 'x-www-form-urlencoded' },
		Version: '2009-01-01',
	},
	SpecialRequests: [ 'GetLowestPricedOffersForASIN', 'GetLowestPricedOffersForSKU' ],
	MarketplaceListActions: [ 'ListOrders' ],
	Defaults: {
		RequestParams: {
			SignatureMethod: 'HmacSHA256',
			SignatureVersion: '2',
		},
		HTTPMethod: 'POST',
	},
}
