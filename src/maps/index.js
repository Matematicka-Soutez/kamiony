'use strict'

const _ = require('lodash')
const log = require('../../core/logger').errorLogger

function getMap(code) {
  try {
    return require(`./data/${code}`) // eslint-disable-line global-require
  } catch (err) {
    log.error('Map not found: ', code, err)
    return null
  }
}

function getSimplified(map) {
  const { cities, connections } = _.cloneDeep(map)
  return {
    cities: cities.map(city => _.pick(city, ['id', 'name', 'position', 'connections'])),
    connections,
  }
}

function getPrices(map) {
  const prices = {}
  map.cities.forEach(city => {
    prices[city.id] = city.price
  })
  return prices
}

module.exports = {
  getMap,
  getSimplified,
  getPrices,
}
