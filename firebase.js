// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAAFlrulkPqbf52S4AbmhO5ff3uBNONf6Y',
  authDomain: 'matc-184ae.firebaseapp.com',
  projectId: 'matc-184ae',
  storageBucket: 'matc-184ae.appspot.com',
  messagingSenderId: '770319428426',
  appId: '1:770319428426:web:549c9bb309eeccee19afb3',
  measurementId: 'G-EXTZJ2QW6N',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()
// analytics.isSupported()
// const analytics = getAnalytics(app)

export { auth, db }
