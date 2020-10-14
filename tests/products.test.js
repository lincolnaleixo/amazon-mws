const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs-extra')
const AmazonMWS = require('../src/core.js')
const testConfig = require('./config.test.json')
const rootPath = path.join(__dirname);

(async () => {
	const mws = new AmazonMWS(testConfig.CREDENTIALS)
	const dumpFolder = path.join(rootPath, 'dump', 'products')
	const api = 'Products'
	const action = 'GetMatchingProductForId'
	const response = await mws.request({
		Api: api,
		Action: action,
		Params: {
			MarketplaceId: testConfig.PRODUCTS.MarketplaceId,
			IdType: testConfig.PRODUCTS.IdType,
			'IdList.Id.1': testConfig.PRODUCTS['IdList.Id.1'],
		},
	})
	console.log(JSON.stringify(response, null, 2))
	const databaseFilePath = path.join(dumpFolder, `${action}.json`)
	fs.ensureFileSync(databaseFilePath)
	jsonfile.writeFileSync(databaseFilePath, response, { spaces: 2 })
	console.log(`${action} response saved on ${dumpFolder}`)

	console.log('Testing products Ended')
})()
