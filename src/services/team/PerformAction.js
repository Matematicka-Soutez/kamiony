/* eslint-disable max-len */
'use strict'

const TransactionalService = require('../../../core/services/TransactionalService')
const teamActionRepository = require('../../repositories/teamAction')
const teamStateRepository = require('../../repositories/teamState')
const gameRepository = require('../../repositories/game')
const gameEnums = require('../../utils/enums')

module.exports = class PerformActionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, min: 1 },
      },
      oneOf: [{
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.SELL.id, gameEnums.ACTIONS.PURCHASE.id] },
          actionValue: { type: 'integer', required: true, min: 1, max: 30 },
        },
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.UPGRADE_CAPACITY.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.CAPACITIES.idsAsEnum },
        },
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.UPGRADE_RANGE.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.RANGE_COEFFICIENTS.idsAsEnum },
        },
      }, {
        properties: {
          actionId: { type: 'integer', required: true, enum: [gameEnums.ACTIONS.MOVE.id] },
          actionValue: { type: 'integer', required: true, enum: gameEnums.CITIES.idsAsEnum },
        },
      }],
    }
  }

  async run() {
    const { teamId, gameCode, actionId } = this.data
    let map = {}
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
      gameEnums.ACTIONS.MOVE.id,
    ].includes(actionId)) {
      // TODO: read map
      map = {}
    }
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const teamAction = prepareTeamAction(game.id, map, this.data)
    const currentTeamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    validateTeamAction(teamAction, currentTeamState)
    await teamActionRepository.create(teamAction, dbTransaction)
    const newTeamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    if ([
      gameEnums.ACTIONS.SELL.id,
      gameEnums.ACTIONS.PURCHASE.id,
    ].includes(actionId)) {
      // TODO: update map
    }
    // TODO: update team in firebase
    return newTeamState
  }
}

function prepareTeamAction(gameId, map, { teamId, actionId, actionValue }) {

}

function validateTeamAction(teamAction, teamState) {
  const newState = applyAction(teamAction, teamState)
  if (newState.balance < 0) {

  }
}

function applyAction(teamAction, teamState) {

}
