'use strict'

const GetGameService = require('../services/game/GetGame')

/**
 * Game middleware
 *
 * Most of the application relies on knowledge of current game.
 * This makes current game available to all services.
 */

async function setGame(ctx, next) {
  ctx.state.game = await new GetGameService(ctx.state).execute({
    gameCode: ctx.params.gameCode,
  })
  return next()
}

module.exports = {
  setGame,
}
