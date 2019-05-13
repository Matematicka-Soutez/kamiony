'use strict'

const enums = require('../../../core/enums')
const TransactionalService = require('../../../core/services/TransactionalService')
const appErrors = require('../../../core/errors/application')
const crypto = require('../../utils/crypto')
// const mailer = require('../../utils/email/mailer')
const validators = require('../../utils/validators')
const userRepository = require('./../../repositories/user')

module.exports = class SignUpService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        firstName: validators.validateName({ required: true, maxLength: 40 }),
        lastName: validators.validateName({ required: true, maxLength: 80 }),
        email: validators.emailValidator({ required: true }),
        password: validators.passwordValidator({ required: true }),
        problemScanningToken: { type: 'string', required: true, minLength: 8, maxLength: 40 },
      },
    }
  }

  async run() {
    validators.advancePasswordValidation(this.data.password)
    const newUser = await parseUserFromRequest(this.data)
    const transaction = await this.createOrGetTransaction()
    const alreadyExistsByEmail = await userRepository.findByEmail(newUser.email, transaction)
    const alreadyExistsByToken = await userRepository.findByProblemScanningToken(newUser.problemScanningToken, transaction)
    if (alreadyExistsByEmail || alreadyExistsByToken) {
      throw new appErrors.UserPotentiallyExistsError('token', true)
    }
    newUser.publicToken = await crypto.generateRandomToken()
    newUser.lastLoginAt = new Date().toISOString()
    const createdUser = await userRepository.create(newUser, transaction)
    // await mailer.sendInviteEmail({
    //   toAddress: createdUser.email,
    //   confirmToken: createdUser.publicToken,
    //   fullName: `${createdUser.firstName} ${createdUser.lastName}`,
    // })
    createdUser.accessToken = await crypto.generateAccessToken(createdUser.id)
    return parseUserForResponse(createdUser)
  }
}

async function parseUserFromRequest(data) {
  return {
    firstName: validators.formatName(data.firstName),
    lastName: validators.formatName(data.lastName),
    email: data.email.toLowerCase(),
    password: await crypto.hashPassword(data.password),
    roleId: enums.ROLES.DRAFTSMAN.id,
    problemScanningToken: data.problemScanningToken,
  }
}

function parseUserForResponse(user) {
  if (!user) {
    throw new Error('User is empty in response parsing')
  }
  const parsed = {}
  parsed.id = user.id
  parsed.firstName = user.firstName
  parsed.lastName = user.lastName
  parsed.email = user.email
  parsed.confirmed = user.confirmed
  parsed.accessToken = user.accessToken

  return parsed
}
