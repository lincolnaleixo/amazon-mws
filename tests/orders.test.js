const jsonfile = require('jsonfile')
const path = require('path')
const Main = require('../src/index')
const credentials = JSON.parse(process.env.CREDENTIALS);

(async () => {
	const main = new Main(credentials, process.env.MARKETPLACE_COUNTRY_CODE)
	const createdAfter = '2020-11-20T00:00:00.000'
	const createdBefore = '2020-07-03T23:59:59.999'
	const ordersList = await main.Orders
		.listOrders(createdAfter)
	const dumpFolder = path.join(__dirname, '..', 'dump')
	jsonfile.writeFileSync(path.join(dumpFolder, `orders.json`), ordersList, { spaces: 2 })
	console.log(`Total orders: ${ordersList.length}`)
	console.log('Orders Ended')
})()
