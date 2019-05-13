'use strict'

const SOCKET_NOTIFICATION_MESSAGE_TYPE = {
  AUTHENTICATED: {
    type: 'authenticated',
    action: 'authentication',
    name: 'Authenticated',
  },
  AUTHENTICATED_ERROR: {
    type: 'authenticatedError',
    action: 'authentication',
    name: 'Authenticated error',
  },
}

module.exports = SOCKET_NOTIFICATION_MESSAGE_TYPE
