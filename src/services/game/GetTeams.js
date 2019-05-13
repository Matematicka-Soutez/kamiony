'use strict'

const _ = require('lodash')
const AbstractService = require('../../../core/services/AbstractService')
const teamRepository = require('../../repositories/team')

module.exports = class GetTeamsByGameService extends AbstractService {
  async run() {
    const teams = await teamRepository.findAllByGame(this.game.id)
    return teams.map(team => _.pick(team, ['id', 'name', 'number']))
  }
}
