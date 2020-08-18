const jsonfile = require('jsonfile')
const path = require('path')
const moment = require('moment')
const Main = require('../src/main')
const options = require('./resources.json')
require('dotenv').config()

const credentials = {
	AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	SecretAccessKey: process.env.SECRET_ACCESS_KEY,
	SellerId: process.env.SELLER_ID,
	MarketplaceId: process.env.MARKETPLACE_ID,
};

(async () => {
	const main = new Main(credentials)
	const params = {
		MarketplaceId: credentials.MARKETPLACE_ID,
		FeedType: '_POST_PRODUCT_PRICING_DATA_',
	}
	const response = await main.Feeds.submit(params, options.feeds)
	const cacheFolder = path.join(__dirname, '..', 'cache')
	jsonfile.writeFileSync(path.join(cacheFolder, `feeds.json`), response, { spaces: 2 })
	console.log('Feeds Ended')
})()
