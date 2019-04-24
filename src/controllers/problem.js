'use strict'

const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')
const UpdateTeamSolutionsService = require('../services/problem/UpdateTeamSolutions')

async function updateTeamSolutions(ctx) {
  try {
    console.log(ctx.request.body)
    ctx.body = await new UpdateTeamSolutionsService(ctx.state)
      .execute({
        gameCode: 'sim007',
        teamNumber: parseInt(ctx.request.body.team),
        problemNumber: parseInt(ctx.request.body.problem),
        password: ctx.request.body.password,
        action: ctx.request.body.action,
      })
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError) {
      throw new responseErrors.UnauthorizedError('Heslo není platné.')
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Tým nebyl nalezen.')
    }
    throw err
  }
}

module.exports = {
  updateTeamSolutions,
}
