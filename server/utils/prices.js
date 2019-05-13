'use strict'

const enums = require('./enums')

function getPurchaseVolume(teamState, prices) {
  const { cityId, balance, goodsVolume, capacityId } = teamState
  const purchasePrice = prices[cityId].purchase || 1000
  const affordableVolume = Math.floor(balance / purchasePrice)
  return Math.min(enums.CAPACITIES.ids[capacityId].value - goodsVolume, affordableVolume)
}

module.exports = {
  getPurchaseVolume,
}
