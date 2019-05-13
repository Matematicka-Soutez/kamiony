'use strict'

const VerifyTokenPayloadService = require('../services/user/VerifyTokenPayload')
const { mapResponseError } = require('../middleware/authentication')
const events = require('./events')

const getResultsRoom = () => 'results'
const getOrganizerRoomId = organizerId => `org${organizerId}`

const publishToClient = (client, type, message) => {
  if (!client || !type) {
    throw new Error('client and type is required when publishing new message')
  }
  client.emit(type, message)
}


let socketServer = null

const initPublish = server => {
  socketServer = server
  socketServer.on('connection', client => {
    client.on('authentication', async data => {
      try {
        const { user } = new VerifyTokenPayloadService({}).execute({
          jwtToken: data.accessToken,
        })
        publishToClient(client, events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED.type)
        const roomId = getOrganizerRoomId(user.id)
        return client.join(roomId)
      } catch (err) {
        return publishToClient(
          client,
          events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED_ERROR.type,
          mapResponseError(err),
        )
      }
    })
    client.on('subscribeToResultsChange', () => {
      publishToClient(client, 'resultsChange')
      const roomId = getResultsRoom()
      return client.join(roomId)
    })
  })
}

const publishResultsChange = results => {
  if (!results) {
    throw new Error('results are required when publishing results change')
  }
  return socketServer.to(getResultsRoom())
    .emit('resultsChange', results)
}

module.exports = {
  initPublish,
  publishResultsChange,
}
