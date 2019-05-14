'use strict'

const db = require('../database')
const parsers = require('./repositoryParsers')

async function getByCode(code, dbTransaction) {
  const game = await db.Game.findOne({
    where: { code },
    transaction: dbTransaction,
  })
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

async function getResults(gameId, dbTransaction) {
  const teams = await db.Team.findAll({
    where: { gameId },
    include: [{
      model: db.TeamSolvedProblemCount,
      as: 'solvedProblemCount',
      attributes: ['solvedProblems'],
      required: false,
    }, {
      model: db.TeamState,
      as: 'teamState',
      attributes: ['balance', 'goodsVolume'],
      required: false,
    }],
    order: [
      db.sequelize.literal('"teamState.balance" DESC'),
      db.sequelize.literal('"solvedProblemCount.solvedProblems" DESC'),
      db.sequelize.literal('"teamState.goodsVolume" DESC'),
    ],
    transaction: dbTransaction,
  })
  return parsers.parseResults(teams)
}

module.exports = {
  getByCode,
  gameExists,
  create,
  update,
  clearData,
  getResults,
}
