'use strict'

Promise = require('bluebird')
const Chance = require('chance')
const _ = require('lodash')
const db = require('../../server/database')

const chance = new Chance()

async function createGame(defaults) {
  const year = new Date().getFullYear()
  const game = _.assign({}, {
    code: chance.pickone(['live42', 'cb34bhio']),
    date: chance.date({ month: 5, year }),
    isPublic: chance.bool(),
  }, defaults)
  const created = await db.Game.create(game)
  return _.assign({}, game, { id: created.id })
}

async function createTeam(defaults = {}) {
  const team = _.assign({
    name: chance.word({ syllables: chance.integer({ min: 2, max: 5 }) }),
    group: chance.pickone(['Karlov - M1', 'Mala Strana - S3', 'Mala Strana - S9', 'Plzen - Aula']),
  }, defaults)
  const created = await db.Team.create(team)
  return _.assign(team, { id: created.id })
}

function createN(amount, generator) {
  return Promise.map(new Array(amount), () => generator())
}

module.exports = {
  createGame,
  createTeam,
  createN,
}
