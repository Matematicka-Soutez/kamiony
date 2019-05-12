'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

async function getByCode(code, dbTransaction) {
  const game = await db.Game.findOne({
    where: { code },
    transaction: dbTransaction,
  })
  if (!game) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseGame(game)
}

async function gameExists(code, dbTransaction) {
  const game = await db.Game.findOne({
    where: { code },
    transaction: dbTransaction,
  })
  return Boolean(game)
}

async function create(game, dbTransaction) {
  const createdGame = await db.Game.create(game, { transaction: dbTransaction })
  return parsers.parseGame(createdGame)
}

async function update(id, data, dbTransaction) {
  const game = await db.Game.update(data, {
    where: { id },
    transaction: dbTransaction,
  })
  return parsers.parseGame(game)
}

async function clearData(gameId, dbTransaction) {
  await db.TeamAction.destroy({ where: { gameId }, transaction: dbTransaction })
}

module.exports = {
  getByCode,
  gameExists,
  create,
  update,
  clearData,
}
