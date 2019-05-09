'use strict'

const _ = require('lodash')
const AbstractService = require('../../../core/services/AbstractService')
const gameRepository = require('../../repositories/game')
const teamRepository = require('../../repositories/team')

module.exports = class GetTeamsByGameService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  async run() {
    const game = await gameRepository.getByCode(this.data.gameCode)
    const teams = await teamRepository.findAllByGame(game.id)
    return teams.map(team => _.pick(team, ['id', 'name', 'number']))
  }
}
