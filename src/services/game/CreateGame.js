'use strict'

Promise = require('bluebird')
const _ = require('lodash')
const appErrors = require('../../../core/errors/application')
const TransactionalService = require('../../../core/services/TransactionalService')
const gameRepository = require('../../repositories/game')
const teamRepository = require('../../repositories/team')
const { getMap } = require('../../maps')

module.exports = class CreateGameService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        mapCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
        teams: {
          type: 'array',
          minItems: 2,
          maxItems: 1000,
          items: {
            type: 'Object',
            properties: {
              number: { type: 'integer', required: true, minimum: 1 },
              name: { type: 'string', required: true, minLength: 1, maxLength: 80 },
              masoId: { type: 'integer', required: false, minimum: 1 },
              group: { type: 'string', required: false, minLength: 1, maxLength: 80 },
            },
          },
        },
      },
    }
  }

  async run() {
    const { gameCode, mapCode, teams } = this.data
    const dbTransaction = await this.createOrGetTransaction()
    if (await gameRepository.gameExists(gameCode, dbTransaction)) {
      throw new appErrors.AlreadyExistsError()
    }
    if (!getMap(mapCode)) {
      throw new appErrors.NotFoundError()
    }
    const game = await gameRepository.create({
      code: gameCode,
      map: mapCode,
    }, dbTransaction)
    await teamRepository.bulkCreate(teams, dbTransaction)
    return {
      result: 'Hra úspěšně vytvořena.',
      gameId: game.id,
      gameCode: game.code,
      map: game.map,
      teamCount: teams.length,
    }
  }
}
