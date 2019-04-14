'use strict'

Promise = require('bluebird')
const _ = require('lodash')
const {
  createVenue,
  createRoom,
  createGame,
  createGameVenue,
  createGameVenueRoom,
} = require('./generators')

async function initStatic() {
  const games = await initGames()
  const venues = await initVenues()
  const rooms = await initRooms(venues)
  const gameVenues = await initGameVenues(games, venues)
  await initGameVenueRooms(gameVenues, rooms)
  return { games, rooms, venues, gameVenues }
}

function initVenues() {
  const venues = [{
    id: 1,
    name: 'MFF Malá Strana',
    defaultCapacity: 86,
  }, {
    id: 2,
    name: 'Brno',
    defaultCapacity: 30,
  }, {
    id: 3,
    name: 'MFF Karlov',
    defaultCapacity: 48,
  }]
  return Promise.map(venues, venue => createVenue(venue))
}

function initRooms(venues) {
  const rooms = [{
    id: 1,
    name: 'S3',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    id: 2,
    name: 'S4',
    defaultCapacity: 14,
    venueId: venues[0].id,
  }, {
    id: 3,
    name: 'S5',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    id: 4,
    name: 'S9',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    id: 5,
    name: 'GML',
    defaultCapacity: 30,
    venueId: venues[1].id,
  }, {
    id: 6,
    name: 'M1',
    defaultCapacity: 20,
    venueId: venues[2].id,
  }, {
    id: 7,
    name: 'M2',
    defaultCapacity: 28,
    venueId: venues[2].id,
  }]
  return Promise.map(rooms, room => createRoom(room))
}

function initGames() {
  const games = [{
    id: 1,
    code: 'sim007',
    date: new Date('2019-04-14T08:00:00.000Z'),
    start: new Date('2019-04-14T08:00:00.000Z'),
    end: new Date('2019-04-14T09:30:00.000Z'),
    isPublic: true,
  }]
  return Promise.map(games, game => createGame(game))
}

async function initGameVenues(games, venues) {
  const gameVenues = await Promise.mapSeries(
    games,
    game => Promise.mapSeries(
      venues,
      venue => createGameVenue({
        capacity: venue.defaultCapacity,
        gameId: game.id,
        venueId: venue.id,
      }),
    ),
  )
  return _.flatten(gameVenues)
}

function initGameVenueRooms(gameVenues, rooms) {
  const gameVenueRooms = [{
    gameVenueId: gameVenues[0].id,
    roomId: rooms[0].id,
    capacity: rooms[0].defaultCapacity,
  }, {
    gameVenueId: gameVenues[0].id,
    roomId: rooms[1].id,
    capacity: rooms[1].defaultCapacity,
  }, {
    gameVenueId: gameVenues[0].id,
    roomId: rooms[2].id,
    capacity: rooms[2].defaultCapacity,
  }, {
    gameVenueId: gameVenues[0].id,
    roomId: rooms[3].id,
    capacity: rooms[3].defaultCapacity,
  }, {
    gameVenueId: gameVenues[1].id,
    roomId: rooms[4].id,
    capacity: rooms[4].defaultCapacity,
  }, {
    gameVenueId: gameVenues[2].id,
    roomId: rooms[5].id,
    capacity: rooms[5].defaultCapacity,
  }, {
    gameVenueId: gameVenues[2].id,
    roomId: rooms[6].id,
    capacity: rooms[6].defaultCapacity,
  }]
  return Promise.map(
    gameVenueRooms,
    gameVenueRoom => createGameVenueRoom(gameVenueRoom),
  )
}

module.exports = initStatic
