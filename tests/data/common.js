'use strict'

const { createTeam, createN } = require('./generators')

const NUMBER_OF_TEAMS = 200

async function initCommon() {
  const teams = await initTeams(1)
  return { teams }
}

function initTeams() {
  return createN(NUMBER_OF_TEAMS, createTeam)
}

module.exports = initCommon
