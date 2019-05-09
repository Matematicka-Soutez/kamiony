'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

async function findById(id, dbTransaction) {
  const team = await db.Team.findById(id, { transaction: dbTransaction })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findAllByGame(gameId, dbTransaction) {
  if (!gameId) {
    throw new Error('gameId is required')
  }
  const teams = await db.Team.findAll({
    where: { gameId },
    transaction: dbTransaction,
  })
  return parsers.parseTeams(teams)
}

async function findByNumberAndGame(number, gameId, dbTransaction) {
  if (!number || !gameId) {
    throw new Error('number and gameId are required')
  }
  const team = await db.Team.findOne({
    where: { number, gameId },
    transaction: dbTransaction,
  })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findAllByGroupAndGame(group, gameId, dbTransaction) {
  if (!group || !gameId) {
    throw new Error('group and gameId are required')
  }
  const teams = await db.Team.findAll({
    where: { gameId, group },
    transaction: dbTransaction,
  })
  return parsers.parseTeams(teams)
}

async function create(team, dbTransaction) {
  const createdTeam = await db.Team.create(team, { transaction: dbTransaction })
  return parsers.parseTeam(createdTeam)
}

async function bulkCreate(teams, dbTransaction) {
  await db.Team.bulkCreate(teams, { transaction: dbTransaction })
  return true
}

async function update(id, data, dbTransaction) {
  const team = await db.Team.update(data, {
    where: { id },
    transaction: dbTransaction,
  })
  return parsers.parseTeam(team)
}

module.exports = {
  findById,
  findAllByGame,
  findByNumberAndGame,
  findAllByGroupAndGame,
  create,
  bulkCreate,
  update,
}
