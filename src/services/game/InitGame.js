'use strict'

const _ = require('lodash')
const config = require('../../config')
const gameEnums = require('../../utils/enums')
const teamActionRepository = require('../../repositories/teamAction')
const gameRepository = require('../../repositories/game')
const TransactionalService = require('./../../../core/services/TransactionalService')
const venueRepository = require('./../../repositories/venue')

module.exports = class InitGameService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  async run() {
    const { gameCode } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const venues = await venueRepository.findGameVenues(game.id, dbTransaction)
    const teams = _.filter(
      _.flatten(_.map(venues, 'teams')),
      ['arrived', true],
    )
    await gameRepository.clearData(game.id, dbTransaction)
    const teamActions = generateTeamActions(game, teams)
    await teamActionRepository.bulkCreate(teamActions, dbTransaction)
    // TODO: set initial map
    // TODO: set initial team states
    return {
      result: 'Initialization successful.',
      teamsEnrolled: teams.length,
    }
  }
}

function generateTeamActions(game, teams) {
  return teams.map(team => _.assign({
    gameId: game.id,
    teamId: team.id,
    actionId: gameEnums.ACTIONS.MOVE.id,
    isDefault: true,
  }, config.game.initialTeamState))
}
