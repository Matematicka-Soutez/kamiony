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
const firebase = require('../../firebase')
const config = require('../../config')

module.exports = class PerformActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, min: 1 },
        actionId: { type: 'integer', required: true, enum: gameEnums.ACTIONS.idsAsEnum },
        actionValue: { type: 'integer', required: true, min: 1, max: 30 },
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
    const { teamId, gameCode, actionId, actionValue } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    let map = {}
    let prices = {}
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
      gameEnums.ACTIONS.MOVE.id,
    ].includes(actionId)) {
      map = (await firebase.collection('maps').doc(gameCode).get()).data()
      prices = (await firebase.collection('prices').doc(gameCode).get()).data()
    }
    const currentTeamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    const teamAction = prepareTeamAction(currentTeamState, map, prices, this.data)
    validateTeamAction(teamAction, currentTeamState)
    await teamActionRepository.create(teamAction, dbTransaction)
    const newTeamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(actionId)) {
      const priceChangeDirection = actionId === gameEnums.ACTIONS.SELL.id ? -1 : 1
      const cityPriceChange = actionValue / config.game.exchangeRateSensitivity
      prices = (await firebase.collection('prices').doc(gameCode).get()).data()
      const purchase = prices[newTeamState.cityId].purchase + (priceChangeDirection * cityPriceChange)
      const sell = prices[newTeamState.cityId].sell + (priceChangeDirection * cityPriceChange)
      await firebase.collection('prices').doc(gameCode).update({
        [`${newTeamState.cityId}.purchase`]: purchase,
        [`${newTeamState.cityId}.sell`]: sell,
      })
    }
    await firebase.collection('teams').doc(`${gameCode}-${teamId}`).update(newTeamState)
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
