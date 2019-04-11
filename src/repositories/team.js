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

async function findByName(name, dbTransaction) {
  const team = await db.Team.findOne({
    where: { name },
    transaction: dbTransaction,
  })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findByNumberAndGame(number, gameId, dbTransaction) {
  const team = await db.Team.findOne({
    where: { number },
    include: [{
      model: db.GameVenue,
      as: 'gameVenue',
      required: true,
      where: { gameId },
    }],
    transaction: dbTransaction,
  })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findAllByVenue(gameId, dbTransaction) {
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
      model: db.Team,
      as: 'teams',
      attributes: ['id', 'name'],
      required: false,
    }],
    order: [
      db.sequelize.literal('"venue"."name" DESC'),
      db.sequelize.literal('"teams"."createdAt" ASC'),
    ],
    transaction: dbTransaction,
  })
  return parsers.parseGameVenues(venues)
}

async function create(team, dbTransaction) {
  const createdTeam = await db.Team.create(team, { transaction: dbTransaction })
  return parsers.parseTeam(createdTeam)
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
  findByName,
  findByNumberAndGame,
  findAllByVenue,
  create,
  update,
}
