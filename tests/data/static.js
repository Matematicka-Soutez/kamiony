'use strict'

Promise = require('bluebird')
const _ = require('lodash')
const {
  createGame,
} = require('./generators')

async function initStatic() {
  const games = await initGames()
  return { games }
}

function initGames() {
  const games = [{
    id: 1,
    code: 'maso25',
    map: 'maso25',
    start: new Date('2019-04-29T13:00:00.000Z'),
    end: new Date('2019-04-29T14:30:00.000Z'),
    isPublic: true,
  }]
  return Promise.map(games, game => createGame(game))
}

module.exports = initStatic
