'use strict'

const Promise = require('bluebird')
const moment = require('moment')
const appErrors = require('../core/errors/application')
const TransactionalService = require('../core/services/TransactionalService')
const config = require('../server/config')
const firebase = require('../server/firebase')
const gameRepository = require('../server/repositories/game')
const teamActionRepository = require('../server/repositories/teamAction')
const { getMap, getProductionInterval } = require('../server/maps')

module.exports = class SimulateProductionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(this.data.gameCode, dbTransaction)
    if (!game) {
      throw new appErrors.NotFoundError()
    }
    if (!isGameRunning(game)) {
      return { message: 'Game isn\'t running at the moment, simulation skipped.' }
    }
    const progress = getGameProgress(game)
    const map = getMap(game.map)
    const coefficients = getProductions(progress, map)
    const since = moment().subtract(config.game.tradeWindowSeconds, 'seconds').toDate()
    const tradeVolume = await teamActionRepository.getTradeVolume(game.id, since, dbTransaction)
    const updates = getExchangeRateUpdates(coefficients, tradeVolume)
    const prices = (await firebase.collection('prices').doc(game.code).get()).data()
    await Promise.map(updates, city => firebase.collection('prices').doc(game.code).update({
      [`${city.id}.purchase`]: prices[city.id].purchase + city.rateChange,
      [`${city.id}.sell`]: prices[city.id].sell + city.rateChange,
    }))
    return {
      progress,
      tradeVolume,
      updates,
    }
  }
}

function isGameRunning(game) {
  const now = moment()
  return now.isSameOrAfter(game.start) && now.isSameOrBefore(game.end)
}

function getGameProgress(game) {
  const gameLength = moment(game.end).diff(game.start, 'seconds')
  const elapsed = moment().diff(game.start, 'seconds')
  return elapsed / gameLength * 100
}

function getProductions(progress, map) {
  return map.cities.map(city => ({
    id: city.id,
    name: city.name,
    coefficient: getProductionInterval(progress, city.production).fn(progress),
  }))
}

function getExchangeRateUpdates(coefficients, tradeVolume) {
  const perWindowEvaluationPeriods
    = config.game.tradeWindowSeconds / config.game.evaluationPeriodSeconds
  const periodTradeVolume = tradeVolume / perWindowEvaluationPeriods
  return coefficients.map(city => ({
    id: city.id,
    name: city.name,
    rateChange: city.coefficient * periodTradeVolume / config.game.exchangeRateSensitivity,
  }))
}
