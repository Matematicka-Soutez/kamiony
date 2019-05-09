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
router.get('/api/games/:gameCode/groups', game.groups)

// Unintentionally public
// TODO: add authorization
router.post('/api/games', game.create)
router.put('/api/games/:gameCode/init', game.init)
router.get('/api/games/:gameCode/productions', game.productions)
router.post('/api/games/:gameCode/teams/:teamId/actions', team.performAction)
router.delete('/api/games/:gameCode/teams/:teamId/actions', team.revertAction)
router.get('/api/games/:gameCode/teams/:teamId/history', team.getHistory)

// Temporary workaround
router.put('/api/games/:gameCode/teams/:teamId/solutions', problem.updateTeamSolutions)
router.put('/api/competitions/current/team-solutions', problem.updateTeamSolutions)

router.use(handleNotFound)

module.exports = router.routes()
