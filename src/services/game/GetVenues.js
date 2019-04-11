'use strict'

const AbstractService = require('../../../core/services/AbstractService')
const venueRepository = require('../../repositories/venue')

module.exports = class GetAllByGameService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameId: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  async run() {
    const gameVenues = await venueRepository.findGameVenues(this.data.gameid)
    return gameVenues.map(gameVenue => ({
      id: gameVenue.venue.id,
      name: gameVenue.venue.name,
      capacity: gameVenue.capacity,
      rooms: gameVenue.gvrooms.map(gvroom => ({
        ...gvroom.room,
        capacity: gvroom.capacity,
        teams: gvroom.teams,
      })),
    }))
  }
}
