'use strict'

const gameRepository = require('../../repositories/game')
const AbstractService = require('./../../../core/services/AbstractService')

module.exports = class GetResultsService extends AbstractService {
  run() {
    return gameRepository.getResults(this.game.id)
  }
}
