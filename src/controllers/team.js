'use strict'

const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')
const socket = require('../sockets/publish')
const PerformActionService = require('../services/team/PerformAction')
const RevertActionService = require('../services/team/RevertAction')
const GetHistoryService = require('../services/team/GetHistory')
const GetTeamStateService = require('../services/team/GetTeamState')
const ChangeTeamStateService = require('../services/team/ChangeTeamState')
const GetResultsService = require('../services/game/GetResults')

async function performAction(ctx) {
  try {
    ctx.body = await new PerformActionService(ctx.state)
      .execute({
        teamId: parseInt(ctx.params.teamId, 10),
        actionId: parseInt(ctx.request.body.actionId, 10),
        actionValue: parseFloat(ctx.request.body.actionValue),
      })
    const results = await new GetResultsService(ctx.state).execute({})
    await socket.publishResultsChange(results)
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
        teamId: parseInt(ctx.params.teamId, 10),
      })
    const results = await new GetResultsService(ctx.state).execute({})
    await socket.publishResultsChange(results)
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

async function getHistory(ctx) {
  try {
    ctx.body = await new GetHistoryService(ctx.state)
      .execute({
        teamId: parseInt(ctx.params.teamId, 10),
      })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Historie nebyla nalezena.')
    }
    throw err
  }
}

async function getTeamState(ctx) {
  try {
    ctx.body = await new GetTeamStateService(ctx.state)
      .execute({
        teamId: parseInt(ctx.params.teamId, 10),
      })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.NotFoundError('Historie nebyla nalezena.')
    }
    throw err
  }
}

async function changeTeamState(ctx) {
  try {
    ctx.body = await new ChangeTeamStateService(ctx.state)
      .execute({
        teamId: parseInt(ctx.params.teamId, 10),
        moveId: parseInt(ctx.request.body.state, 10),
      })
    const results = await new GetResultsService(ctx.state).execute({})
    await socket.publishResultsChange(results)
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

async function revertTeamState(ctx) {
  try {
    await new RevertActionService(ctx.state)
      .execute({
        teamId: parseInt(ctx.params.teamId, 10),
      })
    ctx.body = await new GetTeamStateService(ctx.state)
      .execute({
        teamId: parseInt(ctx.params.teamId, 10),
      })
    const results = await new GetResultsService(ctx.state).execute({})
    await socket.publishResultsChange(results)
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
  getHistory,
  getTeamState,
  changeTeamState,
  revertTeamState,
}
