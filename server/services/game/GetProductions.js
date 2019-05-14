/* eslint-disable id-length */
'use strict'

const _ = require('lodash')
const { getMap, getProductionInterval } = require('../../maps')
const AbstractService = require('../../../core/services/AbstractService')

module.exports = class GetProductionsService extends AbstractService {
  run() {
    const map = getMap(this.game.map)
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
    const interval = getProductionInterval(x, production)
    return [x, interval.fn(x)]
  })
}
