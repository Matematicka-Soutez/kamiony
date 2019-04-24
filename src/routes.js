'use strict'

const Router = require('koa-router')
const responseErrors = require('../core/errors/response')
const config = require('./config')
const { handleErrors, handleNotFound } = require('./middleware/errors')
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
router.get('/api/games/:gameCode/results', game.results)
router.get('/api/games/:gameCode/timer', game.timer)
router.get('/api/games/:gameCode/venues', game.venues)

// Unintentionally public
// TODO: add authorization
router.post('/api/games/:gameCode/init', game.init)
router.post('/api/games/:gameCode/teams/:teamId/actions', team.performAction)
router.delete('/api/games/:gameCode/teams/:teamId/actions', team.revertAction)
router.get('/api/games/:gameCode/teams/:teamId/history', team.getHistory)
// router.put('/api/games/:gameCode/teams/:teamId/solutions', problem.updateTeamSolutions)
// Temporary workaround
router.put('/api/competitions/current/team-solutions', problem.updateTeamSolutions)

router.use(handleNotFound)

module.exports = router.routes()
