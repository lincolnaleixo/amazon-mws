const moment = require('moment')
const DefaultTest = require('./default.test');

(async () => {
	const defaultTest = new DefaultTest()
	const amzMws = defaultTest.amzMws
	const reportType = '_GET_FLAT_FILE_OPEN_LISTINGS_DATA_'
	const reportId = ''
	const sellerId = ''
	const NextToken = ''
	const date = moment(new Date()).subtract(200, 'days')
		.toISOString()
	const orderId = ''
	const startDate = '2020-01-01T09:00:00'
	const endDate = '2030-01-01T09:00:00'
	const marketplaceIdList = [ '' ]
	const feedId = ''
	const feedType = '_POST_PRODUCT_PRICING_DATA_'
	const feedContent = `
	<AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
		<Header>
			<DocumentVersion>1.01</DocumentVersion>
			<MerchantIdentifier>${sellerId}</MerchantIdentifier>
		</Header>
		<MessageType>Price</MessageType>
		<Message>
			<MessageID>1</MessageID>
			<Price>
				<SKU></SKU>
				<StandardPrice currency="USD">9.99</StandardPrice>
				<Sale>
					<StartDate>${startDate}</StartDate>
					<EndDate>${endDate}</EndDate>
					<SalePrice currency="USD">9.99</SalePrice>
				</Sale>
			</Price>
		</Message>
	</AmazonEnvelope>
	`
	// const response = await amzMws.Feeds.submitFeed(feedContent, feedType, marketplaceIdList)
	const response = await amzMws.Feeds.getFeedSubmissionResult(feedId)
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
