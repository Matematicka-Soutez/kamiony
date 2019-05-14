'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameEnums = require('../../utils/enums')
const firebase = require('../../firebase')
const config = require('../../config')


module.exports = class RevertActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    if (this.game.isClosed) {
      throw new appErrors.CannotBeDoneError('Hru v tuto chvíli nelze hrát.')
    }
    const { teamId } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const lastAction = await teamActionRepository.getLatest(teamId, this.game.id, dbTransaction)
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
      const prices = (await firebase.collection('prices').doc(this.game.code).get()).data()
      const price = prices[lastAction.cityId]
      await firebase.collection('prices').doc(this.game.code).update({
        [`${lastAction.cityId}.purchase`]: price.purchase + (priceChangeDirection * cityPriceChange),
        [`${lastAction.cityId}.sell`]: price.sell + (priceChangeDirection * cityPriceChange),
      })
    }
    const teamState = await teamStateRepository.getCurrent(teamId, this.game.id, dbTransaction)
    await firebase.collection('teams').doc(`${this.game.code}-${teamId}`).update(teamState)
    return teamState
  }
}
