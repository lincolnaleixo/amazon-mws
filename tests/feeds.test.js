const jsonfile = require('jsonfile')
const path = require('path')
const AmazonMWS = require('../src/core.js')
const testConfig = require('./config/config.test.json');

(async () => {
	const mws = new AmazonMWS(testConfig.CREDENTIALS)
	const params = {
		FeedType: '_POST_PRODUCT_PRICING_DATA_',
		SellerId: testConfig.FEEDS.SELLER_ID,
		SKU: testConfig.FEEDS.SKU,
		StandardPrice: testConfig.FEEDS.STANDARD_PRICE,
		SalePrice: testConfig.FEEDS.SALES_PRICE,
		SaleStartDate: testConfig.FEEDS.SALE_STARTDATE,
		SaleEndDate: testConfig.FEEDS.SALE_ENDDATE,
	}
	const response = await mws.request({
		Api: 'Feeds',
		Action: 'SubmitFeed',
		Params: params,
	})
	const cacheFolder = path.join(__dirname, '..', 'cache')
	jsonfile.writeFileSync(path.join(cacheFolder, `feeds.json`), response, { spaces: 2 })
	console.log('Feeds Ended')
})()
