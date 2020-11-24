const Products = require('./model/Products.js')
const Reports = require('./model/Reports.js')
const Orders = require('./model/Orders.js')
const Feeds = require('./model/Feeds.js')

function newApi(credentials, marketplaceCountryCode) {
	this.Products = new Products(credentials, marketplaceCountryCode)
	this.Reports = new Reports(credentials, marketplaceCountryCode)
	this.Orders = new Orders(credentials, marketplaceCountryCode)
	this.Feeds = new Feeds(credentials, marketplaceCountryCode)
}

module.exports = newApi
