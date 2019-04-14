'use strict'

const db = require('./../database')
const parsers = require('./repositoryParsers')

async function createTeamSolutionChange(teamSolutionChange, dbTransaction) {
  const teamSolution = await db.TeamSolutionChange.create(
    teamSolutionChange,
    { transaction: dbTransaction },
  )
  return parsers.parseTeamSolution(teamSolution)
}

async function findSolution(teamId, gameId, problemNumber, dbTransaction) {
  const teamSolution = await db.TeamSolution.findOne({
    where: { teamId, gameId, problemNumber, solved: true },
    transaction: dbTransaction,
  })
  return parsers.parseTeamSolution(teamSolution)
}

module.exports = {
  createTeamSolutionChange,
  findSolution,
}
