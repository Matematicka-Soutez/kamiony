'use strict'

Promise = require('bluebird')
const _ = require('lodash')
const TransactionalService = require('../../../core/services/TransactionalService')
const config = require('../../config')
const gameEnums = require('../../utils/enums')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameRepository = require('../../repositories/game')
const venueRepository = require('../../repositories/venue')
const firebase = require('../../firebase')
const sim007 = require('../../data/sim007')

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
    await firebase.collection('maps').doc(gameCode).set(sim007)
    const prices = {}
    sim007.vertices.forEach(vertex => {
      prices[vertex.id] = vertex.price
    })
    await firebase.collection('prices').doc(gameCode).set(prices)
    await Promise.map(teams, async team => {
      const teamState = await teamStateRepository.getCurrent(team.id, game.id, dbTransaction)
      await firebase.collection('teams').doc(`${gameCode}-${team.id}`).set({
        ...teamState,
        team,
      })
    })
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
