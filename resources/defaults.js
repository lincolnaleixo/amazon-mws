module.exports = {
	defaultsParams: {
		SignatureMethod: 'HmacSHA256',
		SignatureVersion: 2,
		Timestamp: '',
		AWSAccessKeyId: '',
		SellerId: '',
		Action: '',
	},
	specialRequests: [ 'GetLowestPricedOffersForASIN', 'GetLowestPricedOffersForSKU' ],
}
