'use strict'

const repository = require('../repository')
const appErrors = require('../../../../../core/errors/application')
const TransactionalService = require('./../../../../../core/services/TransactionalService')

module.exports = class RevertActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameId: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const lastAction = await repository.getLastTeamAction(
      this.data.gameId,
      this.data.teamId,
      dbTransaction,
    )
    if (!lastAction) {
      throw new appErrors.CannotBeDoneError('Žádná předchozí změna neexistuje.')
    }
    await repository.revertTeamActionById(lastAction.id, dbTransaction)
  }
}
