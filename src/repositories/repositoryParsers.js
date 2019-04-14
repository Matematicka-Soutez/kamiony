'use strict'

const _ = require('lodash')

function parseTeams(teams) {
  return teams ? _.map(teams, parseTeam) : teams
}

function parseTeam(team) {
  if (!team) {
    return null
  }
  const parsed = {}
  parsed.id = team.id
  parsed.name = team.name
  parsed.number = team.number
  parsed.arrived = team.arrived
  parsed.createdAt = team.createdAt
  parsed.updatedAt = team.updatedAt

  if (team.gameVenue) {
    parsed.gameVenue = parseGameVenue(team.gameVenue)
  }

  return parsed
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
    'isDefault',
    'reverted',
    'createdAt',
    'updatedAt',
  ])
  if (data.team) {
    teamAction.team = parseTeam(data.team)
  }
  if (data.game) {
    teamAction.game = parseTeam(data.game)
  }
  if (data.previousTeamAction) {
    teamAction.previousTeamAction = parseTeam(data.previousTeamAction)
  }
  return teamAction
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
    teamState.game = parseTeam(data.game)
  }
  return teamState

}

function parseGame(game) {
  if (!game) {
    return game
  }
  const parsed = {}
  parsed.id = game.id
  parsed.code = game.code
  parsed.date = game.date
  parsed.start = game.start
  parsed.end = game.end
  parsed.isPublic = game.isPublic
  parsed.createdAt = game.createdAt
  parsed.updatedAt = game.updatedAt
  return parsed
}

function parseGameVenues(gameVenues) {
  return gameVenues ? _.map(gameVenues, parseGameVenue) : gameVenues
}

function parseGameVenue(gameVenue) {
  if (!gameVenue) {
    return gameVenue
  }
  const parsed = {}
  parsed.id = gameVenue.id
  parsed.capacity = gameVenue.capacity
  parsed.gameId = gameVenue.gameId
  parsed.venueId = gameVenue.venueId

  if (gameVenue.teams) {
    parsed.teams = parseTeams(gameVenue.teams)
  }
  if (gameVenue.venue) {
    parsed.venue = parseVenue(gameVenue.venue)
  }
  if (gameVenue.gvrooms) {
    parsed.gvrooms = parseGameVenueRooms(gameVenue.gvrooms)
  }

  return parsed
}

function parseGameVenueRooms(gvrooms) {
  return gvrooms ? _.map(gvrooms, parseGameVenueRoom) : gvrooms
}

function parseGameVenueRoom(gvroom) {
  if (!gvroom) {
    return gvroom
  }
  const parsed = {}
  parsed.id = gvroom.id
  parsed.capacity = gvroom.capacity
  parsed.roomId = gvroom.roomId
  parsed.gameVenueId = gvroom.gameVenueId

  if (gvroom.teams) {
    parsed.teams = parseTeams(gvroom.teams)
  }

  if (gvroom.room) {
    parsed.room = parseRoom(gvroom.room)
  }

  return parsed
}

function parseRoom(room) {
  if (!room) {
    return room
  }
  const parsed = {}
  parsed.id = room.id
  parsed.name = room.name
  parsed.defaultCapacity = room.defaultCapacity
  return parsed
}

function parseVenue(venue) {
  if (!venue) {
    return venue
  }
  const parsed = {}
  parsed.id = venue.id
  parsed.name = venue.name
  parsed.defaultCapacity = venue.defaultCapacity
  return parsed
}

function parseTeamSolution(problem) {
  if (!problem) {
    return problem
  }
  const parsed = {}
  parsed.id = problem.id
  parsed.gameId = problem.gameId
  parsed.teamId = problem.teamId
  parsed.problemNumber = problem.problemNumber
  parsed.solved = problem.solved
  parsed.createdAt = problem.createdAt
  parsed.updatedAt = problem.updatedAt
  return parsed
}

module.exports = {
  parseTeams,
  parseTeam,
  parseTeamAction,
  parseTeamState,
  parseGame,
  parseGameVenues,
  parseGameVenue,
  parseGameVenueRooms,
  parseGameVenueRoom,
  parseTeamSolution,
}
