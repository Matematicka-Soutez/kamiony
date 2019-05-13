'use strict'

const teamStateRepository = require('../../repositories/teamState')
const AbstractService = require('./../../../core/services/AbstractService')

module.exports = class GetResultsService extends AbstractService {
  run() {
    return teamStateRepository.getResults(this.game.id)
  }
}
