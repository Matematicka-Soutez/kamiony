'use strict'

const VerifyTokenPayloadService = require('../services/user/VerifyTokenPayload')
const appErrors = require('../../core/errors/application')
const responseErrors = require('../../core/errors/response')

function getAuthPayload(authorization) {
  const parsedHeader = parseHeader(authorization)
  if (!parsedHeader
    || !parsedHeader.value
    || !parsedHeader.scheme
    || parsedHeader.scheme.toLowerCase() !== 'jwt'
  ) {
    return null
  }
  return new VerifyTokenPayloadService({}).execute({
    jwtToken: parsedHeader.value,
  })
}

async function authenticate(ctx, next) {
  if (!ctx) {
    throw new Error('Context has to be defined')
  }

  try {
    const data = await getAuthPayload(ctx.header.authorization)
    if (!data) {
      throw new appErrors.UnauthorizedError()
    }

    if (ctx.response && data.loginTimeout) {
      ctx.set('Login-timeout', data.loginTimeout)
    }
    ctx.state.user = data.user
    return next()
  } catch (err) {
    throw mapResponseError(err)
  }
}

function mapResponseError(err) {
  if (err instanceof appErrors.UnauthorizedError) {
    return new responseErrors.UnauthorizedError()
  }
  if (err instanceof appErrors.TokenIdleTimoutError) {
    return new responseErrors.IdleTimeoutError()
  }
  if (err instanceof appErrors.ValidationError) {
    return new responseErrors.ConflictError({
      clientRefreshRequired: true,
      clientRefreshReasons: err.message,
    })
  }
  if (err instanceof appErrors.TokenRevokedError) {
    return new responseErrors.IdleTimeoutError()
  }
  return new responseErrors.UnauthorizedError()
}

function parseHeader(hdrValue) {
  if (!hdrValue || typeof hdrValue !== 'string') {
    return null
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/u)
  return matches && {
    scheme: matches[1],
    value: matches[2],
  }
}

module.exports = {
  getAuthPayload,
  mapResponseError,
  authenticate,
}
