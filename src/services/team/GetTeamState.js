'use strict'

const _ = require('lodash')
const TransactionalService = require('../../../core/services/TransactionalService')
const gameRepository = require('../../repositories/game')
const teamRepository = require('../../repositories/team')
const teamStateRepository = require('../../repositories/teamState')
const { getPossibleMoves } = require('../../utils/textInput')
const firebase = require('../../firebase')
const { getMap } = require('../../maps')

module.exports = class GetTeamStateService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teamId: { type: 'integer', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const { gameCode, teamId } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    const game = await gameRepository.getByCode(gameCode, dbTransaction)
    const team = await teamRepository.findByIdAndGame(teamId, game.id, dbTransaction)
    const teamState = await teamStateRepository.getCurrent(teamId, game.id, dbTransaction)
    const map = getMap(game.map)
    const prices = (await firebase.collection('prices').doc(gameCode).get()).data()
    const moves = getPossibleMoves(teamState, map, prices)
    return {
      id: team.id,
      name: team.name,
      number: team.number,
      score: teamState.balance,
      stateRecord: getStateRecord(teamState, map),
      possibleMoves: moves.map(move => _.pick(move, ['id', 'name'])),
    }
  }
}

function getStateRecord(teamState, map) {
  const { cityId, goodsVolume, petrolVolume, balance } = teamState
  const city = _.find(map.cities, { id: cityId })
  const cityCapital = city.name.charAt(0)
  return `${cityCapital} | ${goodsVolume} | ${petrolVolume} | ${balance}`
}
