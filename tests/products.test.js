const DefaultTest = require('./default.test');

(async () => {
	const defaultTest = new DefaultTest()
	const amzMws = defaultTest.amzMws
	const asinsList = [ 'B00RODKQ7S', 'B00X4PKY5Y' ]
	const asin = 'B00RODKQ7S'
	const sellerSKU = 'OJ-R5YE-4ZHU'
	const sellerSKUList = [ 'OJ-R5YE-4ZHU' ]
	const query = 'harry'
	const feesEstimateRequestList = [
		{
			IdType: 'ASIN',
			IdValue: asin,
			'PriceToEstimateFees.ListingPrice.Amount': 1,
			'PriceToEstimateFees.ListingPrice.CurrencyCode': 'USD',
		},
	]
	const response = await amzMws.Products.getServiceStatus()
	console.log(JSON.stringify(response, null, 2))
	// const dumpFolder = defaultTest.path.join(defaultTest.rootPath, 'dump', 'products')
	// const api = 'Products'
	// const action = 'GetMatchingProductForId'
	// const response = await mws.request({
	// 	Api: api,
	// 	Action: action,
	// 	Params: {
	// 		MarketplaceId: defaultTest.testConfig.PRODUCTS.MarketplaceId,
	// 		IdType: defaultTest.testConfig.PRODUCTS.IdType,
	// 		'IdList.Id.1': defaultTest.testConfig.PRODUCTS['IdList.Id.1'],
	// 	},
	// })
	// console.log(JSON.stringify(response, null, 2))
	// const databaseFilePath = defaultTest.path.join(dumpFolder, `${action}.json`)
	// defaultTest.fs.ensureFileSync(databaseFilePath)
	// defaultTest.jsonfile.writeFileSync(databaseFilePath, response, { spaces: 2 })
	// console.log(`${action} response saved on ${dumpFolder}`)
	//
	// console.log('Testing products Ended')
})()
