'use strict'

const _ = require('lodash')
const TransactionalService = require('../../../core/services/TransactionalService')
const gameRepository = require('../../repositories/game')
const teamRepository = require('../../repositories/team')
const teamStateRepository = require('../../repositories/teamState')
const enums = require('../../utils/enums')
const { getShortestPath } = require('../../utils/map')
const { getPurchaseVolume } = require('../../utils/prices')
const firebase = require('../../firebase')
const { getMap } = require('../../maps')

const MOVES = [
  { id: 1, name: 'Prodej vše', actionId: enums.ACTIONS.SELL.id },
  { id: 2, name: 'Nakup vše', actionId: enums.ACTIONS.PURCHASE.id },
  { id: 21, name: 'Kapacita 20', actionId: enums.ACTIONS.UPGRADE_CAPACITY.id, actionValue: 2 },
  { id: 22, name: 'Kapacita 30', actionId: enums.ACTIONS.UPGRADE_CAPACITY.id, actionValue: 3 },
  { id: 31, name: 'Dojezd 1.5x', actionId: enums.ACTIONS.UPGRADE_RANGE.id, actionValue: 2 },
  { id: 32, name: 'Dojezd 2x', actionId: enums.ACTIONS.UPGRADE_RANGE.id, actionValue: 3 },
]

module.exports = class GetStateService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const { gameCode, teamId } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const [game, team] = await Promise.all([
      gameRepository.getByCode(gameCode, dbTransaction),
      teamRepository.findByIdAndGame(teamId, dbTransaction),
    ])
    const teamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    const map = getMap(game.map)
    const prices = (await firebase.collection('prices').doc(gameCode).get()).data()
    return {
      id: team.id,
      name: team.name,
      number: team.number,
      score: teamState.balance,
      stateRecord: getStateRecord(teamState, map),
      possibleMoves: getPossibleMoves(teamState, map, prices),
    }
  }
}

function getStateRecord(teamState, map) {
  const { cityId, goodsVolume, petrolVolume, balance } = teamState
  const city = _.find(map.cities, { id: cityId })
  const cityCapital = city.name.charAt(0)
  return `${cityCapital} | ${goodsVolume} | ${petrolVolume} | ${balance}`
}

function getPossibleMoves(teamState, map, prices) {
  const moves = _.orderBy(_.concat(MOVES, getTransferMoves(teamState, map)), 'id')
  if (teamState.goodsVolume < 1) {
    _.remove(moves, MOVES[0])
  }
  if (getPurchaseVolume(teamState, prices) < 1) {
    _.remove(moves, MOVES[1])
  }

  if (teamState.capacityId > 1) {
    _.remove(moves, MOVES[3])
  }
  if (teamState.capacityId > 2) {
    _.remove(moves, MOVES[4])
  }

  if (teamState.rangeCoefficientId > 1) {
    _.remove(moves, MOVES[5])
  }
  if (teamState.rangeCoefficientId > 2) {
    _.remove(moves, MOVES[6])
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
