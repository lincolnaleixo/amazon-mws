// eslint-disable-next-line max-lines-per-function
const fetch = require('node-fetch')
const crypto = require('crypto')
const moment = require('moment')
const xml2js = require('xml2js')

const timestamp = moment()
	.toISOString()

const params = {
	AWSAccessKeyId: accessKeyId,
	Action: 'GetFeedSubmissionList',
	Merchant: sellerId,
	SignatureMethod: 'HmacSHA256',
	SignatureVersion: '2',
	Timestamp: timestamp,
	Version: '2009-01-01',
}(async () => {

	const urlParams = new URLSearchParams(Object.entries(params))

	const stringSignValues = {
		HTTPVerb: 'POST',
		ValueOfHostHeaderInLowercase: 'mws.amazonservices.com',
		HTTPRequestURI: '/',
		CanonicalizedQueryString: urlParams,
	}

	const stringToSign = Object.values(stringSignValues)
		.reduce((string, value) => `${string}\n${value}`)

	const signature = crypto.createHmac('sha256', this.secretAccessKey)
		.update(stringToSign, 'utf8')
		.digest('base64')
	urlParams.append('Signature', signature)

	const headers = { 'Content-Type': 'text/xml' }
	const endpoint = 'https://mws.amazonservices.com/'
	const url = `${endpoint}?${urlParams}`

	const response = await fetch(url, {
		method: 'POST',
		headers,
	})
	const xml = await response.text()

	const json = await xml2js.parseStringPromise(xml /* , options */)

	console.log(JSON.stringify(json, null, 2))

})()
