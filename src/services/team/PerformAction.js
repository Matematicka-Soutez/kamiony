/* eslint-disable max-len */
'use strict'

const _ = require('lodash')
const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameRepository = require('../../repositories/game')
const gameEnums = require('../../utils/enums')
const mapUtils = require('../../utils/map')

module.exports = class PerformActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, min: 1 },
      },
      oneOf: [{
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.SELL.id, gameEnums.ACTIONS.PURCHASE.id] },
          actionValue: { type: 'integer', required: true, min: 1, max: 30 },
        },
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.UPGRADE_CAPACITY.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.CAPACITIES.idsAsEnum },
        },
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.UPGRADE_RANGE.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.RANGE_COEFFICIENTS.idsAsEnum },
        },
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.MOVE.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.CITIES.idsAsEnum },
        },
      }],
    }
  }

  async run() {
    const { teamId, gameCode, actionId } = this.data
    let map = {}
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
      gameEnums.ACTIONS.MOVE.id,
    ].includes(actionId)) {
      // TODO: read map
      map = {}
    }
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const teamAction = prepareTeamAction(game.id, map, this.data)
    const currentTeamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    validateTeamAction(teamAction, currentTeamState)
    await teamActionRepository.create(teamAction, dbTransaction)
    const newTeamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(actionId)) {
      // TODO: update map
    }
    // TODO: update team in firebase
    return newTeamState
  }
}

function prepareTeamAction(lastAction, map, { actionId, actionValue }) {
  switch (actionId) {
    case gameEnums.ACTIONS.SELL.id:
      return _.assign(
        { actionId },
        _.pick(lastAction, ['teamId', 'gameId', 'cityId', 'capacityId', 'rangeCoefficientId']),
        {
          goodsVolume: -actionValue,
          petrolVolume: 0,
          balance: getCityPrices(lastAction.cityId, map).sell * actionValue,
        },
      )
    case gameEnums.ACTIONS.PURCHASE.id:
      return _.assign(
        { actionId },
        _.pick(lastAction, ['teamId', 'gameId', 'cityId', 'capacityId', 'rangeCoefficientId']),
        {
          goodsVolume: actionValue,
          petrolVolume: 0,
          balance: getCityPrices(lastAction.cityId, map).sell * -actionValue,
        },
      )
    case gameEnums.ACTIONS.UPGRADE_CAPACITY.id:
      return _.assign(
        { actionId },
        _.pick(lastAction, ['teamId', 'gameId', 'cityId', 'rangeCoefficientId']),
        {
          capacityId: actionValue,
          goodsVolume: 0,
          petrolVolume: 0,
          balance: -gameEnums.CAPACITIES.ids[actionValue].price,
        },
      )
    case gameEnums.ACTIONS.UPGRADE_RANGE.id:
      return _.assign(
        { actionId },
        _.pick(lastAction, ['teamId', 'gameId', 'cityId', 'capacityId']),
        {
          capacityId: actionValue,
          goodsVolume: 0,
          petrolVolume: 0,
          balance: -gameEnums.RANGE_COEFFICIENTS.ids[actionValue].price,
        },
      )
    case gameEnums.ACTIONS.MOVE.id:
      return _.assign(
        { actionId },
        _.pick(lastAction, ['teamId', 'gameId', 'capacityId', 'rangeCoefficientId']),
        {
          cityId: actionValue,
          goodsVolume: 0,
          petrolVolume: -getDistance(lastAction.cityId, actionValue, map),
          balance: 0,
        },
      )
    default:
      throw new Error('Unsupported action.')
  }
}

function getCityPrices(cityId, map) {
  const city = map.vertices.find(vertex => vertex.id === cityId) || { price: 1000 }
  return city.price
}

function validateTeamAction(teamAction, teamState) {
  const newState = applyAction(teamAction, teamState)
  if (newState.balance < 0) {
    throw new appErrors.CannotBeDoneError('Nemate dostatek penez.')
  }
  if (newState.goodsVolume < 0) {
    throw new appErrors.CannotBeDoneError('Nemate dostatek masa.')
  }
  if (newState.goodsVolume > getCapacity(newState.capacityId)) {
    throw new appErrors.CannotBeDoneError('Nemate dostatecnou prevozni kapacitu.')
  }
  if (newState.petrolVolume < 0) {
    throw new appErrors.CannotBeDoneError('Nemate dostatek benzinu.')
  }
  if (
    newState.capacityId < teamState.capacityId
    || newState.rangeCoefficientId < teamState.rangeCoefficientId
  ) {
    throw new appErrors.CannotBeDoneError('Nelze downgradovat.')
  }
}

function applyAction(teamAction, teamState) {
  return {
    cityId: teamAction.cityId,
    capacityId: teamAction.capacityId,
    rangeCoefficientId: teamAction.rangeCoefficientId,
    goodsVolume: teamState.goodsVolume + teamAction.goodsVolume,
    petrolVolume: teamState.petrolVolume + teamAction.petrolVolume,
    balance: teamState.balance + teamAction.balance,
  }
}

function getCapacity(capacityId) {
  return gameEnums.CAPACITIES.ids[capacityId].value
}

function getDistance(startId, endId, map) {
  const path = mapUtils.getShortestPath(map, startId, endId)
  return path.length
}
