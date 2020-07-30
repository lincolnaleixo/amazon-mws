const jsonfile = require('jsonfile')
const path = require('path')
const moment = require('moment')
const Main = require('../src/main')
require('dotenv').config()

const credentials = {
	AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	SecretAccessKey: process.env.SECRET_ACCESS_KEY,
	SellerId: process.env.SELLER_ID,
	MarketplaceId: process.env.MARKETPLACE_ID,
};

(async () => {
	const main = new Main(credentials)
	const marketplaceId = credentials.MARKETPLACE_ID
	const createdAfter = '2020-07-01T00:00:00.000'
	const createdBefore = '2020-07-03T23:59:59.999'
	const ordersList = await main.Orders
		.requestOrders(marketplaceId, createdAfter, createdBefore)
	const cacheFolder = path.join(__dirname, '..', 'cache')
	jsonfile.writeFileSync(path.join(cacheFolder, `orders.json`), ordersList, { spaces: 2 })
	console.log(`Total orders: ${ordersList.length}`)
	console.log('Orders Ended')
})()
