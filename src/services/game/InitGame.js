'use strict'

Promise = require('bluebird')
const _ = require('lodash')
const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const config = require('../../config')
const gameEnums = require('../../utils/enums')
const gameRepository = require('../../repositories/game')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const teamRepository = require('../../repositories/team')
const firebase = require('../../firebase')
const { getMap, getSimplified, getPrices } = require('../../maps')

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
    const { gameCode, start, end, force } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    if (game.isPublic && !force) {
      throw new appErrors.CannotBeDoneError()
    }
    const teams = await teamRepository.findAllByGame(game.id, dbTransaction)
    const map = getMap(game.map)
    const teamActions = generateTeamActions(game, teams)
    await gameRepository.clearData(game.id, dbTransaction)
    await Promise.all([
      teamActionRepository.bulkCreate(teamActions, dbTransaction),
      gameRepository.update(game.id, { start, end, isPublic: true }, dbTransaction),
      firebase.collection('maps').doc(gameCode).set(getSimplified(map)),
      firebase.collection('prices').doc(gameCode).set(getPrices(map)),
    ])
    await Promise.map(teams, async team => {
      const teamState = await teamStateRepository.getCurrent(team.id, game.id, dbTransaction)
      await firebase.collection('teams').doc(`${gameCode}-${team.id}`).set({
        ...teamState,
        team,
      })
    })
    return {
      result: 'Hra je byla inicializována a brzy začne.',
      teamCount: teams.length,
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
