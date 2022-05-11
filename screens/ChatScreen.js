import { View, Text } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native'
import Header from '../components/Header'
import ChatList from '../components/ChatList'

const ChatScreen = () => {
  const tw = useTailwind()

  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen
