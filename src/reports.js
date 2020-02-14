const fetch = require('node-fetch')
const moment = require('moment')
const xml2js = require('xml2js')
const Core = require('./core')

class Reports {

	constructor(credentials) {

		this.credentials = credentials
		this.version = '2009-01-01'
		this.signatureMethod = 'HmacSHA256'
		this.signatureVersion = '2'
		this.core = new Core()

	}

	async requestReport() {

		try {

			const endpoint = 'https://mws.amazonservices.com/'
			const headers = { 'Content-Type': 'text/xml' }

			const timestamp = moment()
				.toISOString()

			const params = {
				AWSAccessKeyId: this.credentials.accessKeyId,
				Action: 'GetFeedSubmissionList',
				Merchant: this.credentials.sellerId,
				SignatureMethod: this.signatureMethod,
				SignatureVersion: this.signatureVersion,
				Timestamp: timestamp,
				Version: this.version,
			}

			const urlParams = new URLSearchParams(Object.entries(params))

			const signature = this.core
				.signString(urlParams, this.credentials.secretAccessKey)
			urlParams.append('Signature', signature)

			const url = `${endpoint}?${urlParams}`

			const response = await fetch(url, {
				method: 'POST',
				headers,
			})

			const xml = await response.text()
			const json = await xml2js.parseStringPromise(xml /* , options */)

			return json

		} catch (e) {

			console.log(`Error on requestReport: ${e}`)

		}

	}

}

module.exports = Reports
