'use strict'

const TransactionalService = require('../../../core/services/TransactionalService')
const teamRepository = require('../../repositories/team')
const venueRepository = require('../../repositories/venue')

module.exports = class RegisterSchoolTeamService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameVenueId: { type: 'number', required: true, minimum: 1 },
        teamName: { type: 'string', required: true, minLength: 1, maxLength: 40 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const gameVenue = await venueRepository.findGameVenueById(this.data.gameVenueId, dbTransaction)
    const team = await teamRepository.create({
      name: this.data.teamName.trim(),
      gameVenueId: gameVenue.id,
    }, dbTransaction)
    return {
      success: true,
      team,
    }
  }
}
