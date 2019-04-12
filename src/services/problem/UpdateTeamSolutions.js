'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const config = require('../../config')
const teamSolutionRepository = require('../../repositories/teamSolution')
const teamRepository = require('../../repositories/team')
const gameRepository = require('../../repositories/game')

module.exports = class UpdateTeamSolutionsService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamNumber: { type: 'integer', required: true, minimum: 1 },
        problemNumber: { type: 'integer', required: true, minimum: 1, maximum: 100 },
        password: { type: 'string', required: true, minLength: 1, maxLength: 40 },
        action: { type: 'string', required: true, enum: ['add', 'cancel'] },
      },
    }
  }

  async run() {
    if (!config.scanningPasswords.includes(this.data.password)) {
      throw new appErrors.UnauthorizedError()
    }
    const { gameCode, teamNumber, problemNumber, action } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const team = await teamRepository.findByNumberAndGame(teamNumber, game.id, dbTransaction)
    const teamSolution = await teamSolutionRepository.createTeamSolutionChange({
      gameId: game.id,
      teamId: team.id,
      problemNumber,
      createdBy: null,
      solved: action === 'add',
    }, dbTransaction)
    teamSolution.teamNumber = team.number
    return teamSolution
  }
}
