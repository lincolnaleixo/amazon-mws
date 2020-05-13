module.exports = {
	defaults: {
		400: {
			InputStreamDisconnected: 'There was an error reading the input stream',
			InvalidParameterValue: 'An invalid parameter value was used, or the request size exceeded the maximum accepted size, or the request expired.',
		},
		401: { AccessDenied: 'Access was denied.' },
		403: {
			InvalidAccessKeyId: 'An invalid AWSAccessKeyId value was used.',
			SignatureDoesNotMatch: 'The signature used does not match the server\'s calculated signature value.',
		},
		404: { InvalidAddress: 'An invalid API section or operation value was used, or an invalid path was used.' },
		500: { InternalError: 'There was an internal service failure.' },
		503: {
			QuotaExceeded: 'The total number of requests in an hour was exceeded.',
			RequestThrottled: 'The frequency of requests was greater than allowed.',
		},
	},
	products: {
		400: { InvalidRequest: 'Request has missing or invalid parameters and cannot be parsed.' },
		200: { InvalidUPCidentifier: 'GetMatchingProductForId can return an Invalid UPC identifier error message to an otherwise successfully processed request (i.e. 200 status code) when an external identifier is given (UPC, ISBN, etc.) and no offers/listings are active.'	},
	},
}
