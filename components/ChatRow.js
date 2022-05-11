import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../getMatchedUserInfo'
import { useTailwind } from 'tailwind-rn/dist'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation()
  const { user } = useAuth()
  const [matchedUserInfo, setMatchedUserInfo] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const tw = useTailwind()

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
  }, [matchDetails, user])

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),

    [matchDetails, db]
  )

  return (
    <TouchableOpacity
      style={[tw('flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg '), styles.cardShadow]}
      onPress={() => navigation.navigate('Message', { matchDetails })}>
      <Image style={tw('rounded-full h-16 w-16 mr-4')} source={{ uri: matchedUserInfo?.photoURL }} />
      <View>
        <Text style={tw('text-lg font-semibold')}>{matchedUserInfo?.displayName}</Text>
        <Text> {lastMessage || 'Say Hi!'} </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bottomTextArea: {
    backgroundColor: '#21262e',
    opacity: 0.8,
  },
  break: {
    flexBasis: '100%',
    height: 0,
  },
})