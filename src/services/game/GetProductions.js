/* eslint-disable id-length */
'use strict'

const _ = require('lodash')
const gameRepository = require('../../repositories/game')
const { getMap } = require('../../maps')
const AbstractService = require('../../../core/services/AbstractService')

module.exports = class GetProductionsService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameCode: { type: 'string', required: true, minLength: 6, maxLength: 8 },
      },
    }
  }

  async run() {
    const game = await gameRepository.getByCode(this.data.gameCode)
    const map = getMap(game.map)
    const productions = map.cities.map(city => ({
      name: city.name,
      data: getDatapoints(city.production),
    }))
    return addProductionSum(productions)
  }
}

function addProductionSum(productions) {
  const sum = _.zipWith(
    ...productions.map(production => production.data),
    (...args) => [...args].reduce(_.sum, 0),
  )
  productions.push({
    name: 'Suma',
    data: sum,
  })
  return productions
}

function getDatapoints(production) {
  return Array.from({ length: 100 }, (v, k) => {
    const x = k + 1
    const interval = getInterval(x, production)
    return [x, interval.fn(x)]
  })
}

function getInterval(x, production) {
  return production.find(item => item.interval[1] >= x)
}
