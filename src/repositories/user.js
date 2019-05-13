'use strict'

const appErrors = require('../../core/errors/application')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function create(user, dbTransaction) {
  const createdUser = await db.User.create(user, { transaction: dbTransaction })
  return parsers.parseUser(createdUser)
}

async function findById(id, dbTransaction) {
  const user = await db.User.findByPk(id, { transaction: dbTransaction })
  if (!user) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseUser(user)
}

async function findByEmail(email, dbTransaction) {
  const user = await db.User.findOne({
    where: { email },
    transaction: dbTransaction,
  })
  return parsers.parseUser(user)
}

async function findByProblemScanningToken(token, dbTransaction) {
  const user = await db.User.findOne({
    where: { problemScanningToken: token },
    transaction: dbTransaction,
  })
  return parsers.parseUser(user)
}

module.exports = {
  create,
  findById,
  findByEmail,
  findByProblemScanningToken,
}
