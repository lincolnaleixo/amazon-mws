/* eslint-disable max-lines-per-function */
const Cawer = require('cawer')
const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment-timezone')
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
		console.log(`Requesting orders from ${createdAfter} to ${createdBefore}`)
		let ordersList
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
		try {
			const jsonResponse = await this.request({
				Api: 'Orders',
				Action: 'ListOrders',
				ActionParams,
				Headers: { 'Content-Type': 'x-www-form-urlencoded' },
			})
			ordersList = jsonResponse.ListOrdersResponse.ListOrdersResult.Orders.Order
			ordersList = this.convertOrdersDatesToLA(ordersList)
			let nextToken = jsonResponse.ListOrdersResponse.ListOrdersResult.NextToken || undefined
			while (true) {
				if (nextToken) {
					const nextTokenResponse = await this.requestNextTokenOrders(nextToken)
					ordersList = [ ...ordersList, ...nextTokenResponse.ordersList ]
					nextToken = nextTokenResponse.nextToken
				} else break
			}
		} catch (err) {
			console.log(`Error on requestOrders: ${err}`)
		}

		if (ordersList.length === 0) return []

		// return ordersList.filter((order) => order.OrderStatus !== 'Canceled')
		return ordersList
	}

	async requestNextTokenOrders(nextToken) {
		console.log(`Requesting orders from next token ${nextToken}`)
		let ordersList
		let jsonResponse
		const ActionParams = { NextToken: nextToken }
		try {
			jsonResponse = await this.request({
				Api: 'Orders',
				Action: 'ListOrdersByNextToken',
				ActionParams,
				Headers: { 'Content-Type': 'x-www-form-urlencoded' },
			})
			ordersList = jsonResponse.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult.Orders.Order
			ordersList = this.convertOrdersDatesToLA(ordersList)
		} catch (err) {
			console.log(`Error on requestOrders: ${err}`)
		}

		return {
			// ordersList: ordersList.filter((order) => order.OrderStatus !== 'Canceled'),
			ordersList,
			nextToken: jsonResponse
				.ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult.NextToken || undefined,
		}
	}
}

module.exports = Orders
