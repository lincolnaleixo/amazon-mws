const moment = require('moment')
const DefaultTest = require('./default.test');

(async () => {
	const defaultTest = new DefaultTest()
	const amzMws = defaultTest.amzMws
	const reportType = '_GET_FLAT_FILE_OPEN_LISTINGS_DATA_'
	const reportId = 24359225682018570
	const sellerId = 'A1WFBJU1ENSTGW'
	const NextToken = 'G8Ki7hv0W3KaJqJYLDm0ZAmQazDrhw3CHvEzMsUVSCdiInOWacVK5akODqK2ZFLIxqXyQLkGMBs8VhF73Xgy+/jRzTMfB5TMttulGhltBJFLkWBuSIlS/0JXoYTO4KUmInTAy+XKVmRZBY+oaVuyc9M9cTZROoa8d1fvTkgx9oIz7ceuu6DyxIrqjSrBhGJ+f2GLmUGyr9UGnxD0RJmrryegoU0IPZxXQAYGhCuxoQwhof2BfdhUxHDIGguBU+d5MBO/reDY2s8hGWNNu3VwFU0hrIUQcumUIIYkgmdzyCpNQzRAUqdu/u9W9k/g4x4611Ds5w1QtjVjIEqCKZbZkTOPK+Zzoe2UhIIxsWBAieq9R04VJia2eZr7qoxzk2qc73kOxQKPZaXtK85ahiSrwceQ/83PxoqjC/wa7TCpG82BA1KyEG2j/CeqJo2yYXnKE4QJ5kOQvdLWDdM64sF43g=='
	const date = moment(new Date()).subtract(200, 'days')
		.toISOString()
	const orderId = '111-5201098-4933801'
	const startDate = '2020-01-01T09:00:00'
	const endDate = '2030-01-01T09:00:00'
	const marketplaceIdList = [ 'ATVPDKIKX0DER' ]
	const feedId = '215894018571'
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
				<SKU>N5-BUCS-IPK9</SKU>
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
