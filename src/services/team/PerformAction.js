'use strict'

const utils = require('../../game/utils')
const repository = require('../../repositories/repository')
const gameEnums = require('../../utils/enums')
const TransactionalService = require('./../../../../../core/services/TransactionalService')

module.exports = class PerformActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameId: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, min: 1 },
      },
      oneOf: [{
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.SELL.id, gameEnums.ACTIONS.PURCHASE.id] },
          actionValue: { type: 'integer', required: true, min: 1, max: 30 },
        }
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.UPGRADE_CAPACITY.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.CAPACITIES.idsAsEnum },
        }
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.UPGRADE_RANGE.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.RANGE_COEFFICIENTS.idsAsEnum },
        }
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.MOVE.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.CITIES.idsAsEnum },
        }
      }]
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const tournament = await repository.getTournamentResults(this.competition.id, dbTransaction)
    const currentStrategy = await repository.getCurrentTeamStrategy(
      this.competition.id,
      this.data.teamId,
      dbTransaction,
    )
    const newStrategy = {
      strategy: this.data.strategyId,
      validUntilTournament: tournament.number + 3,
      teamId: this.data.teamId,
      competitionId: this.competition.id,
      previousStrategyId: currentStrategy.id,
      organizerId: this.data.organizerId,
    }
    utils.validateStrategy(newStrategy)
    return repository.setTeamStrategy(newStrategy, dbTransaction)
  }
}
