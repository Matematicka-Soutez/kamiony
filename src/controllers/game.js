'use strict'

const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')
const InitGameService = require('../services/game/InitGame')
const CreateGameService = require('../services/game/CreateGame')
const GetTimerService = require('../services/game/GetTimer')
const GetGroupsByGameService = require('../services/game/GetGroups')
const GetTeamsByGameService = require('../services/game/GetTeams')
const GetResultsService = require('../services/game/GetResults')
const GetProductionsService = require('../services/game/GetProductions')

async function init(ctx) {
  try {
    ctx.body = await new InitGameService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
      start: new Date(ctx.request.body.start),
      end: new Date(ctx.request.body.end),
      force: Boolean(ctx.request.body.force),
    })
  } catch (err) {
    if (err instanceof appErrors.ValidationError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Hra nebyla nalezena.')
    }
    if (err instanceof appErrors.CannotBeDoneError) {
      // eslint-disable-next-line max-len
      throw new responseErrors.BadRequestError('Hra již byla dříve inicializována. Chcete-li přepsat všechna její data, pošlete příznak "force".')
    }
    throw err
  }
}

async function create(ctx) {
  try {
    ctx.body = await new CreateGameService(ctx.state).execute({
      gameCode: ctx.request.body.gameCode,
      mapCode: ctx.request.body.mapCode,
      teams: ctx.request.body.teams,
    })
  } catch (err) {
    if (err instanceof appErrors.ValidationError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Mapa nebyla nalezena.')
    }
    if (err instanceof appErrors.AlreadyExistsError) {
      throw new responseErrors.ConflictError('Hra s daným kódem již existuje.')
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

async function groups(ctx) {
  try {
    ctx.body = await new GetGroupsByGameService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Hra nebyla nalezena.')
    }
    throw err
  }
}

async function teams(ctx) {
  try {
    ctx.body = await new GetTeamsByGameService(ctx.state).execute({
      gameCode: ctx.params.gameCode,
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.NotFoundError('Hra nebyla nalezena.')
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

async function productions(ctx) {
  try {
    ctx.body = await new GetProductionsService(ctx.state).execute({
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
  create,
  timer,
  groups,
  teams,
  results,
  productions,
}
