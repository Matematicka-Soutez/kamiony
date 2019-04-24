'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

async function findAll(teamId, gameId, dbTransaction) {
  const teamHistories = await db.TeamHistory.findAll({
    where: { teamId, gameId },
    transaction: dbTransaction,
  })
  if (!teamHistories) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeamHistories(teamHistories)
}

module.exports = {
  findAll,
}
