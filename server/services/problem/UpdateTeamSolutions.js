'use strict'

const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const config = require('../../config')
const enums = require('../../utils/enums')
const teamSolutionRepository = require('../../repositories/teamSolution')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const teamRepository = require('../../repositories/team')
const userRepository = require('../../repositories/user')
const firebase = require('../../firebase')

module.exports = class UpdateTeamSolutionsService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamNumber: { type: 'integer', required: true, minimum: 1 },
        problemNumber: { type: 'integer', required: true, minimum: 1, maximum: 55 },
        password: { type: 'string', required: true, minLength: 1, maxLength: 40 },
        action: { type: 'string', required: true, enum: ['add', 'cancel'] },
      },
    }
  }

  async run() {
    const { teamNumber, problemNumber, action, password } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const user = await userRepository.findByProblemScanningToken(password, dbTransaction)
    if (!user || !user.confirmed || user.disabled) {
      throw new appErrors.UnauthorizedError()
    }
    if (this.game.isClosed) {
      throw new appErrors.CannotBeDoneError('Hru v tuto chvíli nelze hrát.')
    }
    const team = await teamRepository.findByNumberAndGame(teamNumber, this.game.id, dbTransaction)

    const solution = await teamSolutionRepository.findSolution(team.id, this.game.id, problemNumber, dbTransaction)
    if (action === 'add' && solution) {
      delete solution.gameId
      solution.competitionId = 1
      solution.teamNumber = team.number
      solution.teamId = team.id
      solution.id = 1
      solution.createdBy = 1
      solution.createdAt = '2019-07-30T11:09:52.916Z'
      solution.updatedAt = '2019-07-30T11:09:52.916Z'
      solution.solved = true
      return solution
    }

    const teamSolution = await teamSolutionRepository.createTeamSolutionChange({
      gameId: this.game.id,
      teamId: team.id,
      problemNumber,
      createdBy: user.id,
      solved: action === 'add',
    }, dbTransaction)
    if (action === 'add') {
      const teamState = await teamStateRepository.getCurrent(team.id, this.game.id, dbTransaction)
      const rangeCoefficient = enums.RANGE_COEFFICIENTS.ids[teamState.rangeCoefficientId].value
      await teamActionRepository.create({
        gameId: this.game.id,
        teamId: team.id,
        problemNumber,
        actionId: 6,
        cityId: teamState.cityId,
        capacityId: 0,
        rangeCoefficientId: 0,
        goodsVolume: 0,
        petrolVolume: config.game.problemPrizePetrolVolume * rangeCoefficient,
        balance: config.game.problemPrizeMoney,
      }, dbTransaction)
    } else {
      await teamActionRepository.deleteProblem({
        gameId: this.game.id,
        teamId: team.id,
        problemNumber,
      }, dbTransaction)
    }
    const teamState = await teamStateRepository.getCurrent(team.id, this.game.id, dbTransaction)
    await firebase.collection('teams').doc(`${this.game.code}-${team.id}`).update(teamState)
    delete teamSolution.gameId
    teamSolution.competitionId = 1
    teamSolution.teamNumber = team.number
    return teamSolution
  }
}
