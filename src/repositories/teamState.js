'use strict'

const appErrors = require('../../core/errors/application')
const db = require('../database')
const parsers = require('./repositoryParsers')

async function getResults(gameId, dbTransaction) {
  const teamStates = await db.TeamState.findAll({
    where: { gameId },
    include: [{
      model: db.Team,
      as: 'team',
      required: true,
      include: [{
        model: db.TeamSolvedProblemCount,
        as: 'solvedProblemCount',
        attributes: ['solvedProblems'],
        required: true,
      }],
    }],
    order: [
      ['balance', 'DESC'],
      db.sequelize.literal('"team.solvedProblemCount.solvedProblems" DESC'),
      ['goodsVolume', 'DESC'],
    ],
    transaction: dbTransaction,
  })
  return parsers.parseResults(teamStates)
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
