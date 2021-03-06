/* eslint-disable max-len */
'use strict'

const _ = require('lodash')
const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameEnums = require('../../utils/enums')
const mapUtils = require('../../utils/map')
const firebase = require('../../firebase')
const config = require('../../config')
const { getMap } = require('../../maps')

module.exports = class PerformActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, minimum: 1 },
        actionId: { type: 'integer', required: true, enum: gameEnums.ACTIONS.idsAsEnum },
        actionValue: { type: 'integer', required: true, minimum: 1, maximum: 30 },
      },
      oneOf: [{
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.SELL.id, gameEnums.ACTIONS.PURCHASE.id] },
          actionValue: { type: 'integer', required: true, minimum: 1, maximum: 30 },
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
    if (this.game.isClosed) {
      throw new appErrors.CannotBeDoneError('Hru v tuto chvíli nelze hrát.')
    }
    const { teamId, actionId, actionValue } = this.data
    const map = getMap(this.game.map)
    let prices = {}
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(actionId)) {
      prices = (await firebase.collection('prices').doc(this.game.code).get()).data()
    }
    const dbTransaction = await this.createOrGetTransaction()
    const currentTeamState = await teamStateRepository.getCurrent(teamId, this.game.id, dbTransaction)
    const teamAction = prepareTeamAction(currentTeamState, map, prices, this.data)
    validateTeamAction(teamAction, currentTeamState)
    await teamActionRepository.create(teamAction, dbTransaction)
    const newTeamState = await teamStateRepository.getCurrent(teamId, this.game.id, dbTransaction)
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(actionId)) {
      const priceChangeDirection = actionId === gameEnums.ACTIONS.SELL.id ? -1 : 1
      const cityPriceChange = actionValue / config.game.exchangeRateSensitivity
      prices = (await firebase.collection('prices').doc(this.game.code).get()).data()
      const purchase = prices[newTeamState.cityId].purchase + (priceChangeDirection * cityPriceChange)
      const sell = prices[newTeamState.cityId].sell + (priceChangeDirection * cityPriceChange)
      await firebase.collection('prices').doc(this.game.code).update({
        [`${newTeamState.cityId}.purchase`]: purchase,
        [`${newTeamState.cityId}.sell`]: sell,
      })
    }
    await firebase.collection('teams').doc(`${this.game.code}-${teamId}`).update(newTeamState)
    return newTeamState
  }
}

function prepareTeamAction(teamState, map, prices, { actionId, actionValue }) {
  switch (actionId) {
    case gameEnums.ACTIONS.SELL.id:
      return _.assign(
        { actionId },
        _.pick(teamState, ['teamId', 'gameId', 'cityId', 'capacityId', 'rangeCoefficientId']),
        {
          goodsVolume: -actionValue,
          petrolVolume: 0,
          balance: Math.round(prices[teamState.cityId].sell) * actionValue,
        },
      )
    case gameEnums.ACTIONS.PURCHASE.id:
      return _.assign(
        { actionId },
        _.pick(teamState, ['teamId', 'gameId', 'cityId', 'capacityId', 'rangeCoefficientId']),
        {
          goodsVolume: actionValue,
          petrolVolume: 0,
          balance: Math.round(prices[teamState.cityId].purchase) * -actionValue,
        },
      )
    case gameEnums.ACTIONS.UPGRADE_CAPACITY.id:
      return _.assign(
        { actionId },
        _.pick(teamState, ['teamId', 'gameId', 'cityId', 'rangeCoefficientId']),
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
        _.pick(teamState, ['teamId', 'gameId', 'cityId', 'capacityId']),
        {
          rangeCoefficientId: actionValue,
          goodsVolume: 0,
          petrolVolume: 0,
          balance: -gameEnums.RANGE_COEFFICIENTS.ids[actionValue].price,
        },
      )
    case gameEnums.ACTIONS.MOVE.id:
      return _.assign(
        { actionId },
        _.pick(teamState, ['teamId', 'gameId', 'capacityId', 'rangeCoefficientId']),
        {
          cityId: actionValue,
          goodsVolume: 0,
          petrolVolume: -getDistance(teamState.cityId, actionValue, map),
          balance: 0,
        },
      )
    default:
      throw new Error('Unsupported action.')
  }
}

function validateTeamAction(teamAction, teamState) {
  const newState = applyAction(teamAction, teamState)
  if (
    newState.capacityId < teamState.capacityId
    || newState.rangeCoefficientId < teamState.rangeCoefficientId
  ) {
    throw new appErrors.CannotBeDoneError('Nelze downgradovat.')
  }
  if (newState.balance < 0) {
    throw new appErrors.CannotBeDoneError('Nemáte dostatek peněz.')
  }
  if (newState.goodsVolume < 0) {
    throw new appErrors.CannotBeDoneError('Nemáte dostatek masa.')
  }
  if (newState.goodsVolume > getCapacity(newState.capacityId)) {
    throw new appErrors.CannotBeDoneError('Nemáte dostatečnou převozní kapacitu.')
  }
  if (newState.petrolVolume < 0) {
    throw new appErrors.CannotBeDoneError('Nemáte dostatek benzínu.')
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
