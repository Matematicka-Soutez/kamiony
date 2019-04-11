'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

async function findGameVenues(gameId, dbTransaction) {
  if (!gameId) {
    throw new Error('gameId is required')
  }
  const venues = await db.GameVenue.findAll({
    where: { gameId },
    include: [{
      model: db.Venue,
      as: 'venue',
      required: true,
    }, {
      model: db.GameVenueRoom,
      as: 'gvrooms',
      required: false,
      include: [{
        model: db.Team,
        as: 'teams',
        required: false,
      }, {
        model: db.Room,
        as: 'room',
        required: true,
      }],
    }, {
      model: db.Team,
      as: 'teams',
      required: false,
    }],
    order: [
      db.sequelize.literal('"venue"."name" DESC'),
      db.sequelize.literal('"gvrooms->teams"."number" ASC'),
    ],
    transaction: dbTransaction,
  })
  return parsers.parseGameVenues(venues)
}

async function findGameVenueById(id, dbTransaction) {
  const venue = await db.GameVenue.findById(id, {
    include: [{
      model: db.Team,
      as: 'teams',
      required: false,
    }],
    transaction: dbTransaction,
  })
  if (!venue) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseGameVenue(venue)
}

module.exports = {
  findGameVenues,
  findGameVenueById,
}
