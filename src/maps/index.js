'use strict'

const _ = require('lodash')

function getMap(code) {
  return require(`./data/${code}`) // eslint-disable-line global-require
}

function getSimplified(map) {
  const { cities, connections } = _.cloneDeep(map)
  return {
    cities: cities.map(city => _.pick(city, ['id', 'name', 'position', 'connections'])),
    connections,
  }
}

module.exports = {
  getMap,
  getSimplified,
}
