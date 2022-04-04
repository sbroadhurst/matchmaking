import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn'
import useAuth from '../hooks/useAuth'
import { serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const ModalScreen = () => {
  const tw = useTailwind()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [image, setImage] = useState(null)
  const [job, setJob] = useState(null)
  const [age, setAge] = useState(null)

  const incompleteForm = !image || !job || !age

  const updateUserProfile = () => {
    // setDoc(doc(db, 'users', user.uid), {
    //   id: user.id,
    //   displayName: user.displayName,
    //   photoURL: image,
    //   job,
    //   age,
    //   timestamp: serverTimestamp(),
    // })
    //   .then(() => {
    //     navigation.navigate('Home')
    //   })
    //   .catch((error) => {
    //     alert(error.message)
    //   })
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', paddingTop: 10 }}>
      <Image source={{ uri: 'https://links.papareact.com/2pf' }} style={tw('h-20 w-full')} resizeMode="contain" />

      <Text style={tw('text-xl text-gray-500 p-2 font-bold')}>Welcome {user?.displayName || 'New User'}</Text>

      <Text style={tw('text-center p-4 font-bold text-red-400')}>Step 1: Enter The Profile Pic</Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        placeholder="Enter a Profile Pic URL"
        style={tw('text-center text-xl pb-2')}></TextInput>

      <Text style={tw('text-center p-4 font-bold text-red-400')}>Step 2: Enter your Occupation</Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        placeholder="Enter your Occupation"
        style={tw('text-center text-xl pb-2')}></TextInput>

      <Text style={tw('text-center p-4 font-bold text-red-400')}>Step 3: Enter your age</Text>
      <TextInput
        numeric
        value={age}
        keyboardType="numeric"
        onChangeText={(text) => setAge(text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ''))}
        placeholder="Enter your age"
        style={tw('text-center text-xl pb-2')}></TextInput>

      <TouchableOpacity
        disabled={incompleteForm}
        onPress={updateUserProfile}
        style={[tw('w-64 p-3 rounded-xl absolute bottom-10 '), incompleteForm ? tw('bg-gray-400') : tw('bg-red-400')]}>
        <Text style={tw('text-center text-white text-xl')}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ModalScreen
