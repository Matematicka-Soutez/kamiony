'use strict'

const AbstractService = require('../../../core/services/AbstractService')
const gameRepository = require('../../repositories/game')
const venueRepository = require('../../repositories/venue')

module.exports = class GetAllByGameService extends AbstractService {
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
    const gameVenues = await venueRepository.findGameVenues(game.id)
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
