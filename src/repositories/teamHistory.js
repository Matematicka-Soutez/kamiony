'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

async function findAll(teamId, gameId, dbTransaction) {
  const teamHistory = await db.TeamHistory.findAll({
    where: { teamId, gameId },
    transaction: dbTransaction,
  })
  if (!teamHistory) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeamHistory(teamHistory)
}

module.exports = {
  findAll,
}
