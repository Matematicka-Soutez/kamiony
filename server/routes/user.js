/* eslint-disable max-len */
'use strict'

const Router = require('koa-router')
const user = require('../controllers/user')

const router = new Router()

/**
 * @api {post} /api/sessions Login admin
 * @apiName LoginOrganizer
 * @apiGroup Organizers
 *
 * @apiParam {String{1..256}}   username            Organizer email to verify.
 * @apiParam {String{1..256}}   password            Organizer password to verify.
 *
 * @apiSuccess {Number}         id                  Organizer unique identifier.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse UnauthorizedError
 *
 */
router.post('/sessions', user.login)

/**
 * @api {POST} /api/users Sign Up
 * @apiName SignUp
 * @apiGroup Users
 *
 * @apiParam {String{1..40}}                firstName           User first name.
 * @apiParam {String{1..80}}                lastName            User last name.
 * @apiParam {String{1..80}}                email               User email.
 * @apiParam {String{1..256}}               password            User password.
 *
 * @apiSuccess (Created 201) {Number}       id                  User unique identifier.
 * @apiSuccess (Created 201) {String}       firstName           User first name.
 * @apiSuccess (Created 201) {String}       lastName            User last name.
 * @apiSuccess (Created 201) {String}       email               User email.
 * @apiSuccess (Created 201) {Boolean}      confirmed           User has confirmed email.
 * @apiSuccess (Created 201) {Date}         createdAt           User createdAt timestamp, format: ISO-8601.
 * @apiSuccess (Created 201) {Date}         updatedAt           User updatedAt timestamp, format: ISO-8601.
 *
 * @apiUse BadRequestError
 * @apiUse WrongPasswordFormat
 * @apiUse ConflictError
 *
 */
router.post('/users', user.signUp)

module.exports = router.routes()
