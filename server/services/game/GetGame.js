'use strict'

const appErrors = require('../../../core/errors/application')
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

  async run() {
    const game = await gameRepository.getByCode(this.data.gameCode)
    if (!game) {
      throw new appErrors.NotFoundError()
    }
    return game
  }
}
