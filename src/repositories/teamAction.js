'use strict'

const db = require('../database')
const parsers = require('./repositoryParsers')

async function create(teamAction, dbTransaction) {
  const createdTeamAction = await db.TeamActions.create(teamAction, { transaction: dbTransaction })
  return parsers.parseTeamAction(createdTeamAction)
}

async function getLatest(teamId, gameId, dbTransaction) {
  const teamAction = await db.TeamActions.findOne({
    where: { teamId, gameId, reverted: false },
    order: [['createdAt', 'DESC']],
    transaction: dbTransaction,
  })
  return parsers.parseTeamAction(teamAction)
}

function revertById(teamActionId, dbTransaction) {
  return db.TeamActions.update(
    { reverted: true },
    {
      where: { id: teamActionId },
      transaction: dbTransaction,
      returning: true,
    },
  )
}

module.exports = {
  create,
  getLatest,
  revertById,
}
