'use strict'

const moment = require('moment')
const AbstractService = require('../../../core/services/AbstractService')
const gameRepository = require('../../repositories/game')

module.exports = class GetTimerService extends AbstractService {
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
    const now = moment()
    return {
      start: moment(game.start).diff(now),
      end: moment(game.end).diff(now),
    }
  }
}
