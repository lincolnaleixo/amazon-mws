const jsonfile = require('jsonfile')
const path = require('path')
const Main = require('../archive/last/main')
const testConfig = require('./config.test.json');

(async () => {
	const main = new Main(testConfig.CREDENTIALS)
	const params = {
		MarketplaceId: testConfig.CREDENTIALS.MARKETPLACE_ID,
		FeedType: '_POST_PRODUCT_PRICING_DATA_',
	}
	const response = await main.Feeds.submit(params, testConfig.FEEDS)
	const cacheFolder = path.join(__dirname, '..', 'cache')
	jsonfile.writeFileSync(path.join(cacheFolder, `feeds.json`), response, { spaces: 2 })
	console.log('Feeds Ended')
})()
