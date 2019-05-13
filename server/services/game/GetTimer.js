'use strict'

const moment = require('moment')
const AbstractService = require('../../../core/services/AbstractService')

module.exports = class GetTimerService extends AbstractService {
  run() {
    const now = moment()
    return {
      start: moment(this.game.start).diff(now),
      end: moment(this.game.end).diff(now),
    }
  }
}
