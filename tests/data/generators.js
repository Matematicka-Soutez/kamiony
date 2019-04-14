'use strict'

Promise = require('bluebird')
const Chance = require('chance')
const _ = require('lodash')
const db = require('../../src/database')

const chance = new Chance()

async function createGame(defaults) {
  const year = new Date().getFullYear()
  const game = _.assign({}, {
    code: chance.pickone(['sim007', 'cb34bhio']),
    date: chance.date({ month: 5, year }),
    isPublic: chance.bool(),
  }, defaults)
  const created = await db.Game.create(game)
  return _.assign({}, game, { id: created.id })
}

async function createVenue(defaults) {
  const venue = _.assign({}, {
    name: chance.city(),
    defaultCapacity: chance.integer({ min: 30, max: 90 }),
  }, defaults)
  const created = await db.Venue.create(venue)
  return _.assign({}, venue, { id: created.id })
}

async function createGameVenue(defaults) {
  const gameVenue = _.assign({}, {
    capacity: chance.integer({ min: 30, max: 90 }),
    gameId: 1,
    venueId: 1,
  }, defaults)
  const created = await db.GameVenue.create(gameVenue)
  return _.assign({}, gameVenue, { id: created.id })
}

async function createGameVenueRoom(defaults) {
  const gameVenueRoom = _.assign({}, {
    capacity: chance.integer({ min: 10, max: 30 }),
    gameVenueId: 1,
    roomId: 1,
  }, defaults)
  const created = await db.GameVenueRoom.create(gameVenueRoom)
  return _.assign({}, gameVenueRoom, { id: created.id })
}

async function createRoom(defaults) {
  const room = _.assign({}, {
    name: `${chance.letter({ casing: 'upper' })}${chance.integer({ min: 1, max: 9 })}`,
    defaultCapacity: chance.integer({ min: 10, max: 30 }),
    venueId: 1,
  }, defaults)
  const created = await db.Room.create(room)
  return _.assign({}, room, { id: created.id })
}

async function createTeam(defaults = {}) {
  const team = _.assign({
    name: chance.word({ syllables: chance.integer({ min: 2, max: 5 }) }),
  }, defaults)
  const created = await db.Team.create(team)
  return _.assign(team, { id: created.id })
}

function createN(amount, generator) {
  return Promise.map(new Array(amount), () => generator())
}

module.exports = {
  createGame,
  createVenue,
  createGameVenue,
  createGameVenueRoom,
  createRoom,
  createTeam,
  createN,
}
