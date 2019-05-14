'use strict'

const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')
const GetGameService = require('../services/game/GetGame')

/**
 * Game middleware
 *
 * Most of the application relies on knowledge of current game.
 * This makes current game available to all services.
 */

async function setGame(ctx, next) {
  try {
    ctx.state.game = await new GetGameService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
    return next()
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Vybraná hra (zatím) neexistuje.')
    }
    throw err
  }
}

module.exports = {
  setGame,
}
