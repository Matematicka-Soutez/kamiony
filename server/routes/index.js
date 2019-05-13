'use strict'

const Router = require('koa-router')
const responseErrors = require('../../core/errors/response')
const config = require('../config')
const { handleErrors, handleNotFound } = require('../middleware/errors')
const { authenticate } = require('../middleware/authentication')
const game = require('../controllers/game')
const gameRoutes = require('./game')
const userRoutes = require('./user')

const router = new Router()

const apiRouter = new Router()
apiRouter.use(handleErrors)

// Force redirect http requests to https
if (config.env === 'production' || config.env === 'staging') {
  apiRouter.use((ctx, next) => {
    if (ctx.headers['x-forwarded-proto'] !== 'https') {
      throw new responseErrors.ForbiddenError('Https is required.')
    }
    return next()
  })
}

apiRouter.use(userRoutes)
apiRouter.post('/games', authenticate, game.create)
apiRouter.use('/games/:gameCode', gameRoutes)

apiRouter.use(handleNotFound)
router.use('/api', apiRouter.routes())

module.exports = router.routes()
