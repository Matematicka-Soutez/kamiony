'use strict'

const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')
const PerformActionService = require('../services/team/PerformAction')
const RevertActionService = require('../services/team/RevertAction')

async function performAction(ctx) {
  try {
    ctx.body = await new PerformActionService(ctx.state)
      .execute({
        gameCode: ctx.params.gameCode,
        teamId: parseInt(ctx.params.teamId, 10),
        actionId: parseInt(ctx.request.body.actionId, 10),
        actionValue: parseFloat(ctx.request.body.actionValue),
      })
  } catch (err) {
    if (err instanceof appErrors.CannotBeDoneError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Hra nebyla nalezena.')
    }
    throw err
  }
}

async function revertAction(ctx) {
  try {
    ctx.body = await new RevertActionService(ctx.state)
      .execute({
        gameCode: ctx.params.gameCode,
        teamId: parseInt(ctx.params.teamId, 10),
      })
  } catch (err) {
    if (err instanceof appErrors.CannotBeDoneError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Hra nebyla nalezena.')
    }
    throw err
  }
}

module.exports = {
  performAction,
  revertAction,
}
