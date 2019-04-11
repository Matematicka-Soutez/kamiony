'use strict'

const teamStateRepository = require('../../repositories/teamState')
const AbstractService = require('./../../../core/services/AbstractService')

module.exports = class GetResultsService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameId: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  async run() {
    const results = await teamStateRepository.getResults(this.data.gameId)
    return results
  }
}
