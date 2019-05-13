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
    'school',
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
    'isClosed',
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
  const results = data && data.map(team => ({
    teamId: team.id,
    teamName: team.name,
    teamNumber: team.number,
    group: team.group,
    school: team.school,
    solvedProblems: team.solvedProblemCount ? team.solvedProblemCount.solvedProblems : 0,
    balance: team.teamState ? team.teamState.balance : 0,
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

function parseUser(user) {
  if (!user) {
    return user
  }
  const parsed = {}
  parsed.id = user.id
  parsed.firstName = user.firstName
  parsed.lastName = user.lastName
  parsed.email = user.email
  parsed.password = user.password
  parsed.disabled = user.disabled
  parsed.roleId = user.roleId

  parsed.publicToken = user.publicToken
  parsed.passwordPublicToken = user.passwordPublicToken
  parsed.duplicateResetPasswordToken = user.duplicateResetPasswordToken
  parsed.confirmed = user.confirmed
  parsed.passwordLastUpdatedAt = user.passwordLastUpdatedAt
  parsed.lastLoginAt = user.lastLoginAt
  parsed.createdAt = user.createdAt
  parsed.updatedAt = user.updatedAt
  return parsed
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
  parseUser,
}
