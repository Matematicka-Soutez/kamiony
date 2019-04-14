'use strict'

const firebase = require('firebase/app')

require('firebase/firestore')

const config = {
  apiKey: 'AIzaSyDchDqFhApge1CrnZhhUlGS2Nd-NU8WQdM',
  authDomain: 'maso-42.firebaseapp.com',
  databaseURL: 'https://maso-42.firebaseio.com',
  projectId: 'maso-42',
  storageBucket: 'maso-42.appspot.com',
  messagingSenderId: '887792497749',
}

firebase.initializeApp(config)

module.exports = firebase.firestore()
