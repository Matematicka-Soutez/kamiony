'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

function getResults() {
  throw new Error('Not implemented yet')
}

async function getCurrent(teamId, gameId, dbTransaction) {
  const teamState = await db.TeamState.findOne({
    where: { teamId, gameId },
    include: [{
      model: db.Team,
      as: 'team',
      required: true,
    }],
    transaction: dbTransaction,
  })
  if (!teamState) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeamState(teamState)
}

module.exports = {
  getResults,
  getCurrent,
}
