'use strict'

const db = require('../database')
const parsers = require('./repositoryParsers')

async function create(teamAction, dbTransaction) {
  const createdTeamAction = await db.TeamAction.create(teamAction, { transaction: dbTransaction })
  return parsers.parseTeamAction(createdTeamAction)
}

async function bulkCreate(teamActions, dbTransaction) {
  await db.TeamAction.bulkCreate(teamActions, { transaction: dbTransaction })
  return true
}

async function getLatest(teamId, gameId, dbTransaction) {
  const teamAction = await db.TeamAction.findOne({
    where: { teamId, gameId, reverted: false, problemNumber: 0 },
    order: [['createdAt', 'DESC']],
    transaction: dbTransaction,
  })
  return parsers.parseTeamAction(teamAction)
}

function revertById(teamActionId, dbTransaction) {
  return db.TeamAction.update(
    { reverted: true },
    {
      where: { id: teamActionId },
      transaction: dbTransaction,
      returning: true,
    },
  )
}

function deleteProblem({ gameId, teamId, problemNumber }, dbTransaction) {
  return db.TeamAction.destroy({
    where: { gameId, teamId, problemNumber, actionId: 6 },
    transaction: dbTransaction,
  })
}

module.exports = {
  create,
  bulkCreate,
  getLatest,
  revertById,
  deleteProblem,
}
