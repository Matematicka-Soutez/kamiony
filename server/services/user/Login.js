'use strict'

const AbstractService = require('../../../core/services/AbstractService')
const appErrors = require('../../../core/errors/application')
const crypto = require('../../utils/crypto')
const userRepository = require('./../../repositories/user')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: { type: 'string', required: true, minimum: 1 },
        password: { type: 'string', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const user = await userRepository.findByEmail(this.data.email.toLowerCase())
    if (!user) {
      throw new appErrors.UnauthorizedError()
    }
    if (!user.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    const verified = await crypto.comparePasswords(this.data.password, user.password)

    if (!verified || user.disabled) {
      throw new appErrors.UnauthorizedError()
    }

    const accessToken = await crypto.generateAccessToken(user.id)
    return {
      id: user.id,
      email: user.email,
      accessToken,
    }
  }
}
