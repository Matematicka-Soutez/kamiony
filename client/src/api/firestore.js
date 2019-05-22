import firebase from 'firebase/app'
import 'firebase/firestore'
import { FIREBASE_API_KEY } from '../config'

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'maso-42.firebaseapp.com',
  databaseURL: 'https://maso-42.firebaseio.com',
  projectId: 'maso-42',
  storageBucket: 'maso-42.appspot.com',
  messagingSenderId: '887792497749',
}

firebase.initializeApp(config)

export default firebase.firestore()
