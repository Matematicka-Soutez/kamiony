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
        start: { type: 'date', required: true },
        end: { type: 'date', required: true },
        force: { type: 'boolean', required: true },
      },
    }
  }

  async run() {
    const { start, end, force } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    if (this.game.isPublic && !force) {
      // eslint-disable-next-line max-len
      throw new appErrors.CannotBeDoneError('Hra již byla dříve inicializována. Chcete-li přepsat všechna její data, pošlete příznak "force".')
    }
    if (this.game.isClosed) {
      throw new appErrors.CannotBeDoneError('Hra byla uzavřena, nelze ji znovu inicializovat.')
    }
    const teams = await teamRepository.findAllByGame(this.game.id, dbTransaction)
    const map = getMap(this.game.map)
    const teamActions = generateTeamActions(this.game, teams)
    await gameRepository.clearData(this.game.id, dbTransaction)
    await Promise.all([
      teamActionRepository.bulkCreate(teamActions, dbTransaction),
      gameRepository.update(this.game.id, { start, end, isPublic: true }, dbTransaction),
      firebase.collection('maps').doc(this.game.code).set(getSimplified(map)),
      firebase.collection('prices').doc(this.game.code).set(getPrices(map)),
    ])
    await Promise.map(teams, async team => {
      const teamState = await teamStateRepository.getCurrent(team.id, this.game.id, dbTransaction)
      await firebase.collection('teams').doc(`${this.game.code}-${team.id}`).set({
        ...teamState,
        team,
      })
    })
    return {
      result: 'Hra byla inicializována a brzy začne.',
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
