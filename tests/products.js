/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable no-loop-func */
/* eslint-disable prefer-destructuring */
/* eslint-disable require-jsdoc */
/* eslint-disable max-lines-per-function */
const fs = require('fs')
const path = require('path')
const Products = require('../src/products.js')
const apiResources = require('../resources/apiOperations.js')
const Helper = require('./resources/helper')
const testOptions = require('./resources/options');

(async () => {
	const filename = path.basename(__filename)
		.replace('.js', '')
	const helper = new Helper()
	const config = await helper.get(filename)
	const products = new Products(config.configurati.credentials)
	let action = ''
	let testsResults = ''
	for (const operation of apiResources[config.feature].Operations) {
		try {
			[ action ] = Object.keys(operation)
			process.stdout.write(`Testing ${action}`)

			const operationParams = Object
				.values(apiResources[config.feature].Operations
					.find((item) => Object.keys(item)[0] === action))[0]
			const params = {}

			if (Array.isArray(operationParams)) {
				operationParams.forEach((param) => {
					if (param.indexOf('List') > -1) {
						const key = `${param}.${param.replace('List', '')}.1`
						const paramsObject = testOptions[config.feature][param]
						if (Object.prototype.toString.call(paramsObject) === '[object Object]') {
							for (const keyParam in paramsObject) {
								if (Object.prototype.toString.call(paramsObject[keyParam]) === '[object Object]') {
									for (const keyParam2 in paramsObject[keyParam]) {
										if (Object.prototype.toString.call(paramsObject[keyParam][keyParam2]) === '[object Object]') {
											for (const keyParam3 in paramsObject[keyParam][keyParam2]) {
												params[`${key}.${keyParam}.${keyParam2}.${keyParam3}`] = paramsObject[keyParam][keyParam2][keyParam3]
											}
										} else {
											params[`${key}.${keyParam}.${keyParam2}`] = paramsObject[keyParam][keyParam2]
										}
									}
								} else {
									params[`${key}.${keyParam}`] = paramsObject[keyParam]
								}
							}
						} else { params[key] = testOptions[config.feature][param][0] }
					} else params[param] = testOptions[config.feature][param]
				})
			}
			const response = await products.request(action, params)

			fs.writeFileSync(`${config.dumpPath}/${action}.json`, JSON.stringify(response, 2))
			process.stdout.write('\x1b[32m Pass ✓ \x1B[0m\r\n')
			testsResults += `${action} test Passed ✓\n`
		} catch (err) {
			process.stdout.write('\x1b[32m Fail x \x1B[0m\r\n')
			console.log(err)
			testsResults += `${action} test Failed x\n`
		}
	}
	fs.writeFileSync(`${config.dumpPath}/${testOptions.testsResultsFile}`, testsResults)
})()
