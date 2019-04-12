'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameRepository = require('../../repositories/game')
const gameEnums = require('../../utils/enums')

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
    const lastAction = await teamActionRepository.getLatest(game.id, teamId, dbTransaction)
    if (lastAction.isDefault) {
      throw new appErrors.CannotBeDoneError('Žádná předchozí změna neexistuje.')
    }
    await teamActionRepository.revertById(lastAction.id, dbTransaction)
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(lastAction.actionId)) {
      // TODO: update map prices
    }
    const teamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    // TODO: update team
    return teamState
  }
}
