/* eslint-disable no-underscore-dangle */
'use strict'

const _map = require('lodash/map')
const _find = require('lodash/find')
const _filter = require('lodash/filter')
const _concat = require('lodash/concat')

function emptyPath() {
  return {
    connections: [],
    cities: [],
    length: 0,
  }
}

function getShortestPath(map, startCityId, endCityId) {
  const queue = []
  const solutions = []

  for (let i = 1; i <= map.cities.length; i++) {
    solutions[i] = {
      dist: 1000,
      path: [],
    }
  }

  solutions[startCityId] = {
    dist: 0,
    path: [],
  }

  queue.push(_find(map.cities, { id: startCityId }))

  while (queue.length !== 0) {
    const previous = queue.shift()
    previous.connections.forEach(connectionId => {
      const nextId = connectionToDestination(connectionId, previous.id, map)
      const connection = _find(map.connections, { id: connectionId })
      const previousCity = solutions[previous.id]
      if (solutions[nextId].dist > previousCity.dist + connection.length) {
        const city = _find(map.cities, { id: nextId })
        solutions[nextId] = {
          dist: previousCity.dist + connection.length,
          path: _concat(previousCity.path, connection),
          cities: _concat(previousCity.cities, city),
        }
        queue.push(city)
      }
    })
  }

  return {
    connections: _map(solutions[endCityId].path, 'id'),
    cities: _map(solutions[endCityId].cities, 'id'),
    length: solutions[endCityId].dist,
  }
}

function connectionToDestination(connectionId, cityId, map) {
  const cityEdges = _find(map.connections, { id: connectionId })
  const destinations = _filter(
    cityEdges.cities,
    city => city !== cityId,
  )
  return destinations[0]
}

module.exports = {
  emptyPath,
  getShortestPath,
}
