'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameRepository = require('../../repositories/game')
const gameEnums = require('../../utils/enums')
const firebase = require('../../firebase')
const config = require('../../config')


module.exports = class RevertActionService extends TransactionalService {
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
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const lastAction = await teamActionRepository.getLatest(teamId, game.id, dbTransaction)
    if (lastAction.isDefault) {
      throw new appErrors.CannotBeDoneError('Žádná předchozí změna neexistuje.')
    }
    await teamActionRepository.revertById(lastAction.id, dbTransaction)
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(lastAction.actionId)) {
      const priceChangeDirection = lastAction.actionId === gameEnums.ACTIONS.SELL.id ? 1 : -1
      const cityPriceChange = Math.abs(lastAction.goodsVolume) / config.game.exchangeRateSensitivity
      const prices = (await firebase.collection('prices').doc(gameCode).get()).data()
      const price = prices[lastAction.cityId]
      await firebase.collection('prices').doc(gameCode).update({
        [`${lastAction.cityId}.purchase`]: price.purchase + (priceChangeDirection * cityPriceChange),
        [`${lastAction.cityId}.sell`]: price.sell + (priceChangeDirection * cityPriceChange),
      })
    }
    const teamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    await firebase.collection('teams').doc(`${gameCode}-${teamId}`).update(teamState)
    return teamState
  }
}
