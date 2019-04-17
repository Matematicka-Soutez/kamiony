/* eslint-disable no-await-in-loop */
'use strict'

Promise = require('bluebird')
const request = require('request-promise')
// const config = require('../src/config')
// const { ACTIONS } = require('../src/utils/enums')

const HOSTNAME = 'https://maso-staging.herokuapp.com'

async function runSimulation() {
  const teams = await getTeams()
  const problemNumber = 1
  while (true) { // eslint-disable-line no-constant-condition
    await addSolvedProblems(teams, problemNumber)
    await performMoves(teams)
    const sleepTime = Math.random() * 300
    await Promise.delay(sleepTime)
  }
}

async function addSolvedProblems(teams, problemNumber) {
  // for each team do a dice roll and if success
  await Promise.mapSeries(teams, async team => {
    const success = Math.random() > 0.8
    if (success) {
      await request({
        method: 'PUT',
        uri: `${HOSTNAME}/api/competitions/current/team-solutions`,
        body: JSON.stringify({
          team: team.number,
          problemNumber,
          password: 'zluty-bagr',
          action: 'add',
        }),
      })
    }
  })
}

async function performMoves(teams) {
  await Promise.mapSeries(teams, team => moveTeam(team))
}

async function moveTeam(team) {

}

async function getTeams() {
  // fetch teams from API
}

runSimulation()
