import { Text, Button, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import { useTailwind } from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper'
// import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../firebase'

// const DUMMY_DATA =

const HomeScreen = () => {
  const navigation = useNavigation()
  const { user, logout } = useAuth()
  const tw = useTailwind()
  const swiperRef = useRef(null)
  const [profiles, setProfiles] = useState([
    {
      firstName: 'Gandalf',
      lastName: 'the Grey',
      displayName: 'GandalfTheGrey',
      id: '1',
      photoURL:
        'https://static.wikia.nocookie.net/lotr/images/e/e7/Gandalf_the_Grey.jpg/revision/latest?cb=20121110131754',
      job: 'Wizard',
      age: 60,
    },
    {
      firstName: 'Mark',
      lastName: 'Zuckerberg',
      displayName: 'Faceman',
      id: '2',
      photoURL:
        'https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
      job: 'Chairman, CEO',
      age: 37,
    },
    {
      firstName: 'Machu',
      lastName: 'Picchu',
      displayName: 'MachuThePicchu',
      id: '3',
      photoURL:
        'https://images.unsplash.com/photo-1530999811698-221aa9eb1739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjaHUlMjBwaWNjaHUlMjBwZXJ1fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      job: 'Royal Estate',
      age: 570,
    },
  ])

  useLayoutEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate('Modal')
        }
      })
      return unsub()
    }
  }, [])

  useEffect(() => {
    let unsub

    const fetchCards = async () => {
      // can get rid of this user  check stuff when the auth stuff is working
      let passedUserIds = ['pass-test']
      let likedUserIds = ['likes-test']

      if (user) {
        const passes = await getDocs(collection(db, 'users', user.id, 'passes')).then((snapshot) =>
          snapshot.docs.map((doc) => doc.id)
        )

        const likes = await getDocs(collection(db, 'users', user.id, 'likes')).then((snapshot) =>
          snapshot.docs.map((doc) => doc.id)
        )

        passedUserIds = passes.length > 0 ? passes : ['pass-test']
        likedUserIds = likes.length > 0 ? likes : ['likes-test']
      }

      unsub = onSnapshot(
        query(collection(db, 'users'), where('id', 'not-in', [...passedUserIds, ...likedUserIds])),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          )
        }
      )
    }
    fetchCards()
    return unsub()
  }, [db])

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return
    const userSwiped = profiles[cardIndex]
    console.log(`you swiped PASS on ${userSwiped.displayName}`)
    setDoc(doc(db, 'users', user.id, 'passes', userSwiped.id), userSwiped)
  }

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return
    const userSwiped = profiles[cardIndex]
    console.log(`you swiped LIKE on ${userSwiped.displayName}`)
    setDoc(doc(db, 'users', user.id, 'likes', userSwiped.id), userSwiped)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 0.85 }}>
        {/* Header */}
        <View style={tw('flex-row items-center justify-between h-20 px-5 mt-3')}>
          <TouchableOpacity onPress={logout}>
            <Image
              style={tw('h-10 w-10 rounded-full')}
              source={{
                uri: user?.photoURL || 'https://i.pinimg.com/originals/fc/19/19/fc1919b811cb4e44166a59d460e73654.png',
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
            <Image style={tw('h-14 w-14')} source={require('../assets/favicon.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
          </TouchableOpacity>
        </View>
        {/* End of header */}
        {/* Cards */}
        <View style={tw('flex-1 -mt-6')}>
          <Swiper
            ref={swiperRef}
            containerStyle={{ backgroundColor: 'transparent' }}
            cards={profiles}
            stackSize={5}
            cardIndex={0}
            animateCardOpacity
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => {
              console.log('swipe no')
              swipeLeft(cardIndex)
            }}
            onSwipedRight={(cardIndex) => {
              console.log('swipe match')
              swipeRight(cardIndex)
            }}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    textAlign: 'right',
                    color: 'red',
                  },
                },
              },
              right: {
                title: 'MATCH',
                style: {
                  label: {
                    color: '#4DED30',
                  },
                },
              },
            }}
            renderCard={(card) => {
              return card ? (
                <View key={card.id} style={tw('relative bg-slate-200 h-3/4 rounded-xl')}>
                  <Image style={tw('absolute top-0 h-full w-full rounded-xl')} source={{ uri: card.photoURL }} />

                  <View
                    style={[
                      tw(
                        'absolute flex-row bottom-0 justify-between items-center  w-full h-auto px-6 py-2 rounded-b-xl'
                      ),
                      styles.cardShadow,
                      styles.bottomTextArea,
                    ]}>
                    <View>
                      <Text style={tw('text-xl font-bold text-neutral-50')}>{card.displayName}</Text>
                      <Text style={tw('text-neutral-50')}>{card.job}</Text>
                    </View>
                    <Text style={tw('text-2xl font-bold text-neutral-50')}>{card.age}</Text>
                    {/* <View style={styles.break} /> */}
                  </View>
                </View>
              ) : (
                <View
                  style={[tw('relative bg-slate-200 h-3/4 rounded-xl justify-center items-center'), styles.cardShadow]}>
                  <Text style={tw('font-bold pb-5')}>No More Profiles</Text>

                  <Image
                    style={tw('h-20 w-20')}
                    height={100}
                    width={100}
                    source={{ uri: 'https://links.papareact.com/6gb' }}
                  />
                </View>
              )
            }}></Swiper>
        </View>
      </View>

      <View style={[tw('flex-row justify-evenly'), { flex: 0.1 }]}>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          style={tw('items-center justify-center rounded-full w-16 h-16 bg-red-200')}>
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          style={tw('items-center justify-center rounded-full w-16 h-16 bg-green-200')}>
          <Entypo name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

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
