'use strict'

const Router = require('koa-router')
const config = require('../config')
const { handleErrors, handleNotFound } = require('../middleware/errors')
const responseErrors = require('../../core/errors/response')
const game = require('./controllers/game')
const team = require('./controllers/team')
const problem = require('./controllers/problem')

const router = new Router()
router.use(handleErrors)

// Force redirect http requests to https
if (config.env === 'production' || config.env === 'staging') {
  router.use((ctx, next) => {
    if (ctx.headers['x-forwarded-proto'] !== 'https') {
      throw new responseErrors.ForbiddenError('Https is required.')
    }
    return next()
  })
}

// Intentionally public
router.get('/api/game/:gameId/results', game.results)
router.get('/api/game/:gameId/timer', game.timer)
router.get('/api/game/:gameId/venues', game.venues)

// Unintentionally public
// TODO: add authorization
router.post('/api/game/:gameId/init', game.init)
router.post('/api/game/:gameId/team/:teamId/trade', team.trade)
router.post('/api/game/:gameId/team/:teamId/move', team.move)
router.post('/api/game/:gameId/team/:teamId/upgrade', team.upgrade)
router.put('/api/game/:gameId/team/:teamId/revert-change', team.revertChange)
router.put('/api/game/:gameId/team/:teamId/solutions', problem.updateTeamSolutions)

router.use(handleNotFound)

module.exports = router.routes()
