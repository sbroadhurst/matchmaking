import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as Google from 'expo-auth-session/providers/google'
// import * as WebBrowser from 'expo-web-browser'
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
  const [accessToken, setAccessToken] = useState()
  const [idToken, setIdToken] = useState()
  const [user, setUser] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '770319428426-ln4ea6qavm8cl27ound4q35n4oo0bm32.apps.googleusercontent.com',
    iosClientId: '770319428426-83ejqhcs25i012as36p3nd82ers5npor.apps.googleusercontent.com',
    webClientId: '770319428426-ln4ea6qavm8cl27ound4q35n4oo0bm32.apps.googleusercontent.com',
    expoClientId: '770319428426-j41u29g0csp07flgvirblvpeqo8bd6a0.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    permissions: ['public_profile', 'email', 'gender', 'location'],
  })

  useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // logged in...
    //     setUser(user)
    //   } else {
    //     // not logged in
    //     setUser(null)
    //   }
    //   setLoadingInitial(false)
    // })

    setLoadingInitial(false)

    if (response?.type === 'success') {
      console.log(response)
      setAccessToken(response.authentication.accessToken)
    }
  }, [response])

  // async function getUserData() {
  //   let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   })

  //   userInfoResponse.json().then((data) => {
  //     console.log(data)
  //   })
  // }

  const signInWithGoogle = async () => {
    setLoading(true)
    promptAsync({ useProxy: false, showInRecents: true })
    // .then(async (loginResult) => {
    //   console.log(loginResult)
    //   if (loginResult.type === 'success') {
    //     // login
    //     const { idToken, accessToken } = loginResult
    //     const credential = GoogleAuthProvider.credential(idToken, accessToken)
    //     await signInWithCredential(auth, credential)
    //   }
    //   return Promise.reject()
    // })
    // .catch((error) => setError(error))
    // .finally(() => setLoading(false))
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
