'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const config = require('../../config')
const teamSolutionRepository = require('../../repositories/teamSolution')
const teamRepository = require('../../repositories/team')

module.exports = class UpdateTeamSolutionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
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
    const dbTransaction = await this.createOrGetTransaction()
    const team = await teamRepository.findByNumberAndGame(
      this.data.teamNumber,
      this.data.gameId,
      dbTransaction,
    )
    const teamSolution = await teamSolutionRepository.createTeamSolutionChange({
      competitionId: this.competition.id,
      teamId: team.id,
      problemNumber: this.data.problemNumber,
      createdBy: null,
      solved: this.data.action === 'add',
    }, dbTransaction)

    teamSolution.teamNumber = team.number
    return teamSolution
  }
}
