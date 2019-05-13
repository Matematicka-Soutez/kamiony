'use strict'

const AbstractService = require('../../../core/services/AbstractService')
const gameRepository = require('../../repositories/game')

module.exports = class GetGameService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  run() {
    return gameRepository.getByCode(this.data.gameCode)
  }
}
