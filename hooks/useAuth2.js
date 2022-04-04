import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as Google from 'expo-google-app-auth'
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext({})

const config = {
  androidClientId: '770319428426-ln4ea6qavm8cl27ound4q35n4oo0bm32.apps.googleusercontent.com',
  iosClientId: '770319428426-83ejqhcs25i012as36p3nd82ers5npor.apps.googleusercontent.com',
  webClientId: '770319428426-ln4ea6qavm8cl27ound4q35n4oo0bm32.apps.googleusercontent.com',
  expoClientId: '770319428426-j41u29g0csp07flgvirblvpeqo8bd6a0.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location'],
}

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // logged in...
        setUser(user)
      } else {
        // not logged in
        setUser(null)
      }
      setLoadingInitial(false)
    })
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    await Google.logInAsync(config)
      .then(async (loginResult) => {
        if (loginResult.type === 'success') {
          // login
          const { idToken, accessToken } = loginResult
          const credential = GoogleAuthProvider.credential(idToken, accessToken)
          await signInWithCredential(auth, credential)
        }
        return Promise.reject()
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  const logout = () => {
    setLoading(true)
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      signInWithGoogle,
    }),
    [user, loading, error]
  )

  return <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}
