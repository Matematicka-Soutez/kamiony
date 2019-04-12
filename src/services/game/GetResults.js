'use strict'

const teamStateRepository = require('../../repositories/teamState')
const gameRepository = require('../../repositories/game')
const AbstractService = require('./../../../core/services/AbstractService')

module.exports = class GetResultsService extends AbstractService {
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
    const results = await teamStateRepository.getResults(game.id)
    return results
  }
}
