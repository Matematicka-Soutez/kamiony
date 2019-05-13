/* eslint-disable max-len */
'use strict'

const AbstractService = require('../../../core/services/AbstractService')
const teamStateRepository = require('../../repositories/teamState')
const firebase = require('../../firebase')
const gameEnums = require('../../utils/enums')
const { getPurchaseVolume } = require('../../utils/prices')
const { getActionFromMove } = require('../../utils/textInput')
const PerformActionService = require('./PerformAction')
const GetTeamStateService = require('./GetTeamState')

module.exports = class ChangeTeamStateService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, minimum: 1 },
        moveId: { type: 'integer', required: true, minimum: 1, maximum: 32 },
      },
    }
  }

  async run() {
    const { teamId, moveId } = this.data
    const action = getActionFromMove(moveId)

    if (action.id === gameEnums.ACTIONS.SELL.id) {
      const teamState = await teamStateRepository.getCurrent(teamId, this.game.id)
      action.value = teamState.goodsVolume
    }

    if (action.id === gameEnums.ACTIONS.PURCHASE.id) {
      const teamState = await teamStateRepository.getCurrent(teamId, this.game.id)
      const prices = (await firebase.collection('prices').doc(this.game.code).get()).data()
      action.value = getPurchaseVolume(teamState, prices)
    }

    await new PerformActionService({ game: this.game }).execute({
      teamId,
      actionId: action.id,
      actionValue: action.value,
    })

    return new GetTeamStateService({ game: this.game }).execute({ teamId })
  }
}
