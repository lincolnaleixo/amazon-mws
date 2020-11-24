const jsonfile = require('jsonfile')
const path = require('path')
const Main = require('../archive/last/main')
const testConfig = require('./config.test.json');

(async () => {
	const main = new Main(testConfig.CREDENTIALS)
	const createdAfter = '2020-06-01T00:00:00.000'
	const createdBefore = '2020-07-03T23:59:59.999'
	const ordersList = await main.Orders
		.processOrders(testConfig.CREDENTIALS.MWS_MARKETPLACE_ID, createdAfter, createdBefore)
	const dumpFolder = path.join(__dirname, '..', 'dump')
	jsonfile.writeFileSync(path.join(dumpFolder, `orders.json`), ordersList, { spaces: 2 })
	console.log(`Total orders: ${ordersList.length}`)
	console.log('Orders Ended')
})()

