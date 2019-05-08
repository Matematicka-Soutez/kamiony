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

function getShortestPath(map, startcityId, endcityId) {
  const queue = []
  const solutions = []

  for (let i = 1; i <= map.cities.length; i++) {
    solutions[i] = {
      dist: 1000,
      path: [],
    }
  }

  solutions[startcityId] = {
    dist: 0,
    path: [],
  }

  queue.push(_find(map.cities, { id: startcityId }))

  while (queue.length !== 0) {
    const previous = queue.shift()
    previous.connections.forEach(connectionId => {
      const nextId = connectionToDestination(connectionId, previous.id, map)
      const connection = _find(map.connections, { id: connectionId })
      const previouscity = solutions[previous.id]
      if (solutions[nextId].dist > previouscity.dist + connection.length) {
        const city = _find(map.cities, { id: nextId })
        solutions[nextId] = {
          dist: previouscity.dist + connection.length,
          path: _concat(previouscity.path, connection),
          cities: _concat(previouscity.cities, city),
        }
        queue.push(city)
      }
    })
  }

  return {
    connections: _map(solutions[endcityId].path, 'id'),
    cities: _map(solutions[endcityId].cities, 'id'),
    length: solutions[endcityId].dist,
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
