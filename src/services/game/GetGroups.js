'use strict'

const _ = require('lodash')
const AbstractService = require('../../../core/services/AbstractService')
const teamRepository = require('../../repositories/team')

module.exports = class GetGroupsByGameService extends AbstractService {
  async run() {
    const teams = await teamRepository.findAllByGame(this.game.id)
    return _.groupBy(teams, 'group')
  }
}
