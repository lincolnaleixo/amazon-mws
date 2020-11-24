const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs-extra')
const testConfig = require('./config.test.json')
const rootPath = path.join(__dirname)
const AmzMwsAPI = require('../src/index.js')

class DefaultTest {
	constructor() {
		this.marketplaceCountryCode = 'US'
		this.jsonfile = jsonfile
		this.path = path
		this.fs = fs
		this.testConfig = testConfig
		this.rootPath = rootPath
		this.amzMws = new AmzMwsAPI(this.testConfig.CREDENTIALS, this.marketplaceCountryCode)
	}
}

module.exports = DefaultTest
