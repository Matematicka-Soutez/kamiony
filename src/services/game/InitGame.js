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
const { getMap, getSimplified } = require('../../maps')

module.exports = class InitGameService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        start: { type: 'date', required: true },
        end: { type: 'date', required: true },
        force: { type: 'boolean', required: true },
      },
    }
  }

  async run() {
    const { gameCode } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const map = getMap(game.map)
    const venues = await venueRepository.findGameVenues(game.id, dbTransaction)
    const teams = _.filter(
      _.flatten(_.map(venues, 'teams')),
      ['arrived', true],
    )
    await gameRepository.clearData(game.id, dbTransaction)
    const teamActions = generateTeamActions(game, teams)
    await teamActionRepository.bulkCreate(teamActions, dbTransaction)
    await firebase.collection('maps').doc(gameCode).set(getSimplified(map))
    const prices = {}
    map.cities.forEach(city => {
      prices[city.id] = city.price
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
      result: 'Hra je byla inicializována a brzy začne.',
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
