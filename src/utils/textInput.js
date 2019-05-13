'use strict'

const _ = require('lodash')
const enums = require('./enums')
const { getShortestPath } = require('./map')
const { getPurchaseVolume } = require('./prices')

const MOVES = [
  { id: 1, name: 'Prodej vše', actionId: enums.ACTIONS.SELL.id },
  { id: 2, name: 'Nakup vše', actionId: enums.ACTIONS.PURCHASE.id },
  { id: 21, name: 'Kapacita 20', actionId: enums.ACTIONS.UPGRADE_CAPACITY.id, actionValue: 2 },
  { id: 22, name: 'Kapacita 30', actionId: enums.ACTIONS.UPGRADE_CAPACITY.id, actionValue: 3 },
  { id: 31, name: 'Dojezd 1.5x', actionId: enums.ACTIONS.UPGRADE_RANGE.id, actionValue: 2 },
  { id: 32, name: 'Dojezd 2x', actionId: enums.ACTIONS.UPGRADE_RANGE.id, actionValue: 3 },
]

function getActionFromMove(moveId) {
  const move = MOVES.find(item => item.id === moveId) || {
    id: moveId,
    actionId: enums.ACTIONS.MOVE.id,
    actionValue: moveId - 2,
  }
  return {
    id: move.actionId,
    value: move.actionValue,
  }
}

function getPossibleMoves(teamState, map, prices) {
  const moves = _.orderBy(_.concat(MOVES, getTransferMoves(teamState, map)), 'id')
  if (teamState.goodsVolume < 1) {
    _.remove(moves, MOVES[0])
  }
  if (getPurchaseVolume(teamState, prices) < 1) {
    _.remove(moves, MOVES[1])
  }

  if (
    teamState.capacityId > 1
    || teamState.balance < enums.CAPACITIES.MEDIUM.price
  ) {
    _.remove(moves, MOVES[2])
  }
  if (
    teamState.capacityId > 2
    || teamState.balance < enums.CAPACITIES.BIG.price
  ) {
    _.remove(moves, MOVES[3])
  }

  if (
    teamState.rangeCoefficientId > 1
    || teamState.balance < enums.RANGE_COEFFICIENTS.MEDIUM.price
  ) {
    _.remove(moves, MOVES[4])
  }
  if (
    teamState.rangeCoefficientId > 2
    || teamState.balance < enums.RANGE_COEFFICIENTS.BIG.price
  ) {
    _.remove(moves, MOVES[5])
  }
  return moves
}

function getTransferMoves(teamState, map) {
  return map.cities
    .filter(city => {
      // Get only cities in range different from current one
      if (city.id === teamState.cityId || teamState.petrolVolume === 0) {
        return false
      }
      const path = getShortestPath(map, teamState.cityId, city.id)
      return teamState.petrolVolume >= path.length
    })
    .map(city => ({
      id: city.id + 2,
      name: `${city.name} (přejezd)`,
      actionId: enums.ACTIONS.MOVE.id,
      actionValue: city.id,
    }))
}

module.exports = {
  getActionFromMove,
  getPossibleMoves,
}
