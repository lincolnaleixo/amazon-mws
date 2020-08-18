/* eslint-disable max-lines-per-function */
const Cawer = require('cawer')
const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment-timezone')
const Core = require('./core')
const cawer = new Cawer()
const contentBoilerPlates = { _POST_PRODUCT_PRICING_DATA_: 'price_boilerplate.xml' }

class Feeds extends Core {

	async submit(params, options) {
		let response
		console.log('Submiting feed')

		const ActionParams = {
			FeedType: params.FeedType,
			'MarketplaceId.Id.1': params.MarketplaceId,
		}
		const contentBoilerPlate = fs
			.readFileSync(path.join(__dirname, `../resources/feeds/${contentBoilerPlates[params.FeedType]}`)).toString()
		const body = contentBoilerPlate
			.replace('$$SKU$$', options.SKU)
			.replace('$$StandardPrice$$', options.StandardPrice)
			.replace('$$SalePrice$$', options.SalePrice)
			.replace('$$SaleStartDate$$', options.SaleStartDate)
			.replace('$$SaleEndDate$$', options.SaleEndDate)
		try {
			const jsonResponse = await this.request({
				Api: 'Feeds',
				Action: 'SubmitFeed',
				ActionParams,
				Body: body,
				Headers: { 'Content-Type': 'x-www-form-urlencoded' },
			})
			console.log(JSON.stringify(jsonResponse, null, 2))
		} catch (err) {
			console.log(`Error on requestOrders: ${err}`)
		}

		return response
	}
}

module.exports = Feeds
