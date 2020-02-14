const crypto = require('crypto')

class Core {

	signString(urlParams, secretAccessKey) {

		try {

			const stringSignValues = {
				HTTPVerb: 'POST',
				ValueOfHostHeaderInLowercase: 'mws.amazonservices.com',
				HTTPRequestURI: '/',
				CanonicalizedQueryString: urlParams,
			}

			const stringToSign = Object.values(stringSignValues)
				.reduce((string, value) => `${string}\n${value}`)

			const signature = crypto.createHmac('sha256', secretAccessKey)
				.update(stringToSign, 'utf8')
				.digest('base64')

			return signature

		} catch (e) {

			console.log(`Error on signString: ${e}`)

		}

	}

}

module.exports = Core
