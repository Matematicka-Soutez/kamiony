'use strict'

const AbstractService = require('../../../core/services/AbstractService')
const teamRepository = require('../../repositories/team')
const teamHistoryRepository = require('../../repositories/teamHistory')


module.exports = class GetHistoryService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const team = await teamRepository.findById(this.data.teamId)
    const history = await teamHistoryRepository.findAll(this.data.teamId, this.game.id)
    return { team, history }
  }
}
