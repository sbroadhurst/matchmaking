import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { useTailwind } from 'tailwind-rn'

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth()
  const navigation = useNavigation()
  const tw = useTailwind()

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [])

  return (
    <View style={tw('flex-1')}>
      {/* <Text>{loading ? 'loading...' : 'LoginScreen'}</Text> */}
      <ImageBackground resizeMode="cover" style={tw('flex-1')} source={{ uri: 'https://tinder.com/static/tinder.png' }}>
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw('absolute bottom-40 w-52 bg-white p-4 rounded-2xl'),
            {
              marginHorizontal: '25%',
            },
          ]}>
          <Text style={tw('text-center font-semibold')}>Sign In & Match Now</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen
