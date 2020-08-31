const jsonfile = require('jsonfile')
const path = require('path')
const AmazonMWS = require('../src/core.js')
const testConfig = require('./config.test.json');

(async () => {
	const mws = new AmazonMWS(testConfig.CREDENTIALS)
	const dumpFolder = path.join(__dirname, 'dump', 'reports')
	let response
	for (const apiOperation in testConfig.REPORTS) {
		if (!testConfig.REPORTS[apiOperation].Skip) {
			console.log(`Executing ${apiOperation}.\nParams:${JSON.stringify(testConfig.REPORTS[apiOperation].Params || {})}\n`)
			response = await mws.request({
				Api: 'Reports',
				Action: apiOperation,
				Params: testConfig.REPORTS[apiOperation].Params || {},
			})
			console.log(JSON.stringify(response, null, 2))
			jsonfile.writeFileSync(path.join(dumpFolder, `${apiOperation}.json`), response, { spaces: 2 })
			console.log(`${apiOperation} response saved on ${dumpFolder}`)
		}
	}

	console.log('Testing Reports Ended')
})()
