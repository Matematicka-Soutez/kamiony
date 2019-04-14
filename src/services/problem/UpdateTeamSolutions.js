'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const config = require('../../config')
const enums = require('../../utils/enums')
const teamSolutionRepository = require('../../repositories/teamSolution')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const teamRepository = require('../../repositories/team')
const gameRepository = require('../../repositories/game')
const firebase = require('../../firebase')

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

    const solution = await teamSolutionRepository.findSolution(team.id, game.id, problemNumber, dbTransaction)
    if (action === 'add' && solution) {
      delete solution.gameId
      solution.competitionId = 1
      solution.createdBy = 1
      solution.teamNumber = team.number
      return solution
    }

    const teamSolution = await teamSolutionRepository.createTeamSolutionChange({
      gameId: game.id,
      teamId: team.id,
      problemNumber,
      createdBy: null,
      solved: action === 'add',
    }, dbTransaction)
    if (action === 'add') {
      const teamState = await teamStateRepository.getCurrent(team.id, game.id, dbTransaction)
      const rangeCoefficient = enums.RANGE_COEFFICIENTS.ids[teamState.rangeCoefficientId].value
      await teamActionRepository.create({
        gameId: game.id,
        teamId: team.id,
        problemNumber,
        actionId: 6,
        cityId: 0,
        capacityId: 0,
        rangeCoefficientId: 0,
        goodsVolume: 0,
        petrolVolume: config.game.problemPrizePetrolVolume * rangeCoefficient,
        balance: config.game.problemPrizeMoney,
      }, dbTransaction)
    } else {
      await teamActionRepository.deleteProblem({
        gameId: game.id,
        teamId: team.id,
        problemNumber,
      }, dbTransaction)
    }
    const teamState = await teamStateRepository.getCurrent(team.id, game.id, dbTransaction)
    await firebase.collection('teams').doc(`${gameCode}-${team.id}`).update(teamState)
    delete teamSolution.gameId
    teamSolution.competitionId = 1
    teamSolution.createdBy = 1
    teamSolution.teamNumber = team.number
    return teamSolution
  }
}
