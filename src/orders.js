const Cawer = require('cawer')
const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const Core = require('./core')
const cawer = new Cawer()

class Orders extends Core {

	convertOrdersDatesToLA(ordersList) {
		const convertedList = []
		for (let i = 0; i < ordersList.length; i += 1) {
			const order = ordersList[i]
			order.LatestShipDate = moment(order.LatestShipDate)
				.tz('America/Los_Angeles')
				.format('YYYY-MM-DDTHH:mm:ss.SSSz')
			order.PurchaseDate = moment(order.PurchaseDate)
				.tz('America/Los_Angeles')
				.format('YYYY-MM-DDTHH:mm:ss.SSSz')
			order.LastUpdateDate = moment(order.LastUpdateDate)
				.tz('America/Los_Angeles')
				.format('YYYY-MM-DDTHH:mm:ss.SSSz')
			order.EarliestShipDate = moment(order.EarliestShipDate)
				.tz('America/Los_Angeles')
				.format('YYYY-MM-DDTHH:mm:ss.SSSz')
			convertedList.push(order)
		}

		return convertedList
	}

	async requestOrders(marketplaceId, createdAfter, createdBefore = undefined) {
		let ordersList
		console.log('Requesting orders')
		const createdAfterOffset = moment(createdAfter).tz('America/Los_Angeles')
			.format('Z')
		const ActionParams = {
			CreatedAfter: createdAfter + createdAfterOffset,
			'MarketplaceId.Id.1': marketplaceId,
		}
		if (createdBefore) {
			const createdBeforeOffset = moment(createdBefore).tz('America/Los_Angeles')
				.format('Z')
			ActionParams.CreatedBefore = createdBefore + createdBeforeOffset
		}
		const jsonResponse = await this.request({
			Api: 'Orders',
			Action: 'ListOrders',
			ActionParams,
		})
		try {
			ordersList = jsonResponse.ListOrdersResponse.ListOrdersResult.Orders.Order
			ordersList = this.convertOrdersDatesToLA(ordersList)
		} catch (err) {
			console.log(`Error on requestOrders: ${err}`)
		}

		if (ordersList.length === 0) return []

		return ordersList.filter((order) => order.OrderStatus !== 'Canceled')
	}
}

module.exports = Orders
