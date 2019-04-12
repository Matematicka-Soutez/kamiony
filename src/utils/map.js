/* eslint-disable no-underscore-dangle */
'use strict'

const _map = require('lodash/map')
const _find = require('lodash/find')
const _filter = require('lodash/filter')
const _concat = require('lodash/concat')

function emptyPath() {
  return {
    edges: [],
    vertices: [],
    length: 0,
  }
}

function getShortestPath(map, startVertexId, endVertexId) {
  const queue = []
  const solutions = []

  for (let i = 1; i <= map.vertices.length; i++) {
    solutions[i] = {
      dist: 1000,
      path: [],
    }
  }

  solutions[startVertexId] = {
    dist: 0,
    path: [],
  }

  queue.push(_find(map.vertices, { id: startVertexId }))

  while (queue.length !== 0) {
    const previous = queue.shift()
    previous.edges.forEach(edgeId => {
      const nextId = edgeToDestination(edgeId, previous.id, map)
      const edge = _find(map.edges, { id: edgeId })
      const previousVertex = solutions[previous.id]
      if (solutions[nextId].dist > previousVertex.dist + edge.length) {
        const vertex = _find(map.vertices, { id: nextId })
        solutions[nextId] = {
          dist: previousVertex.dist + edge.length,
          path: _concat(previousVertex.path, edge),
          vertices: _concat(previousVertex.vertices, vertex),
        }
        queue.push(vertex)
      }
    })
  }

  return {
    edges: _map(solutions[endVertexId].path, 'id'),
    vertices: _map(solutions[endVertexId].vertices, 'id'),
    length: solutions[endVertexId].dist,
  }
}

function edgeToDestination(edgeId, vertexId, map) {
  const vertexEdges = _find(map.edges, { id: edgeId })
  const destinations = _filter(
    vertexEdges.vertices,
    vertex => vertex !== vertexId,
  )
  return destinations[0]
}

module.exports = {
  emptyPath,
  getShortestPath,
}
