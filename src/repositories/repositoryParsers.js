'use strict'

const _ = require('lodash')

function parseTeams(teams) {
  return teams ? _.map(teams, parseTeam) : teams
}

function parseTeam(data) {
  if (!data) {
    return null
  }
  const team = _.pick(data, [
    'id',
    'name',
    'number',
    'masoId',
    'group',
    'solvedProblemsOverride',
    'createdAt',
    'updatedAt',
  ])

  if (data.game) {
    team.game = parseGame(data.game)
  }
  return team
}

function parseTeamAction(data) {
  if (!data) {
    return null
  }
  const teamAction = _.pick(data, [
    'id',
    'gameId',
    'teamId',
    'actionId',
    'previousTeamActionId',
    'cityId',
    'capacityId',
    'rangeCoefficientId',
    'goodsVolume',
    'petrolVolume',
    'balance',
    'problemNumber',
    'isDefault',
    'reverted',
    'createdAt',
    'updatedAt',
  ])
  if (data.team) {
    teamAction.team = parseTeam(data.team)
  }
  if (data.game) {
    teamAction.game = parseGame(data.game)
  }
  if (data.previousTeamAction) {
    teamAction.previousTeamAction = parseTeamAction(data.previousTeamAction)
  }
  return teamAction
}

function parseTeamHistories(histories) {
  return histories ? _.map(histories, parseTeamHistory) : histories
}

function parseTeamHistory(data) {
  return data && _.pick(data, [
    'gameId',
    'teamId',
    'cityId',
    'capacityId',
    'rangeCoefficientId',
    'goodsVolume',
    'petrolVolume',
    'balance',
    'createdAt',
  ])
}

function parseTeamState(data) {
  const teamState = _.pick(data, [
    'gameId',
    'teamId',
    'cityId',
    'capacityId',
    'rangeCoefficientId',
    'goodsVolume',
    'petrolVolume',
    'balance',
  ])
  if (data.team) {
    teamState.team = parseTeam(data.team)
  }
  if (data.game) {
    teamState.game = parseGame(data.game)
  }
  return teamState
}

function parseGame(data) {
  return data && _.pick(data, [
    'id',
    'code',
    'map',
    'start',
    'end',
    'isPublic',
    'createdAt',
    'updatedAt',
  ])
}

function parseTeamSolution(data) {
  return data && _.pick(data, [
    'id',
    'gameId',
    'teamId',
    'problemNumber',
    'solved',
    'createdAt',
    'updatedAt',
  ])
}

function parseResults(data) {
  const results = data && data.map(result => ({
    teamId: result.teamId,
    teamName: result.team.name,
    teamNumber: result.team.number,
    group: result.team.group,
    solvedProblems: result.team.solvedProblems.solvedProblems,
    balance: result.balance,
  }))

  let place = 1
  let lastBalance = -1
  results.forEach(result => {
    if (lastBalance !== result.balance) {
      result.place = `${place}.`
      lastBalance = result.balance
    }
    place++
  })
  return results
}

module.exports = {
  parseTeams,
  parseTeam,
  parseTeamAction,
  parseTeamHistories,
  parseTeamHistory,
  parseTeamState,
  parseGame,
  parseTeamSolution,
  parseResults,
}
