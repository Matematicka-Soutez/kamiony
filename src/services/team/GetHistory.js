'use strict'

const AbstractService = require('../../../core/services/AbstractService')
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

  run() {
    return teamHistoryRepository.findAll(this.data.teamId, this.game.id)
  }
}
