'use strict'

const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')
const InitGameService = require('../services/game/InitGame')
const GetTimerService = require('../services/game/GetTimer')
const GetVenuesByGameService = require('../services/game/GetVenues')
const GetResultsService = require('../services/game/GetResults')

async function init(ctx) {
  try {
    ctx.body = await new InitGameService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
  } catch (err) {
    if (err instanceof appErrors.ValidationError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Hra nebyla nalezena.')
    }
    throw err
  }
}

async function timer(ctx) {
  try {
    ctx.body = await new GetTimerService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Hra nebyla nalezena.')
    }
    throw err
  }
}

async function venues(ctx) {
  try {
    ctx.body = await new GetVenuesByGameService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Hra nebyla nalezena.')
    }
    throw err
  }
}

async function results(ctx) {
  try {
    ctx.body = await new GetResultsService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Hra nebyla nalezena.')
    }
    throw err
  }
}


module.exports = {
  init,
  timer,
  venues,
  results,
}
