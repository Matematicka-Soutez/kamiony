'use strict'

const TransactionalService = require('../../../core/services/TransactionalService')
const teamHistoryRepository = require('../../repositories/teamHistory')
const gameRepository = require('../../repositories/game')


module.exports = class GetHistoryService extends TransactionalService {
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
    return teamHistoryRepository.findAll(teamId, game.id, dbTransaction)
  }
}
