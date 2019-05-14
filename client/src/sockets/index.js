import openSocket from 'socket.io-client'
import { API_ADDRESS } from '../config'

const socket = openSocket(API_ADDRESS)

function subscribeToResultsChange(cb) {
  socket.on('resultsChange', results => cb(null, results))
  socket.emit('subscribeToResultsChange', 1000)
}

export { subscribeToResultsChange }
