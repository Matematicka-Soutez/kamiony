'use strict'

const moment = require('moment')
const AbstractService = require('../../../core/services/AbstractService')

module.exports = class GetTimerService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameId: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  run() {
    const now = moment()
    return {
      start: moment(this.competition.start).diff(now),
      end: moment(this.competition.end).diff(now),
    }
  }
}
