'use strict'

const firebase = require('firebase-admin')
const credential = require('../config').firebase.credential

const config = {
  credential: firebase.credential.cert(credential),
  databaseURL: 'https://maso-42.firebaseio.com',
}

firebase.initializeApp(config)

module.exports = firebase.firestore()
