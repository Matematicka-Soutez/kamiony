'use strict'

Promise = require('bluebird')
const AbstractService = require('../../../core/services/AbstractService')
const appErrors = require('../../../core/errors/application')
const userRepository = require('../../repositories/user')
const crypto = require('../../utils/crypto')

module.exports = class VerifyTokenPayload extends AbstractService {
  schema() {
    return {
      type: 'Object',
      required: true,
      properties: {
        jwtToken: { type: 'string', required: true, maxLength: 2000 },
      },
    }
  }

  async run() {
    const jwtPayload = await crypto.verifyAccessToken(this.data.jwtToken)
    const now = Date.now()
    if (!jwtPayload || !jwtPayload.exp || now >= jwtPayload.exp * 1000) {
      throw new appErrors.UnauthorizedError()
    }

    const userId = parseInt(jwtPayload.userId)
    const user = await userRepository.findById(userId)
    console.log(user)
    if (!user || !user.confirmed || user.disabled) {
      throw new appErrors.UnauthorizedError()
    }
    return {
      user,
      loginTimeout: jwtPayload.exp * 1000,
    }
  }
}
