import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface HeroProps {
  image: string
  state: 'open' | 'closed'
  children: React.ReactNode
}

export default function Hero({ image, state, children }: HeroProps) {
  const [contentHeight, setContentHeight] = useState(200)
  const heroHeight = state === 'open' ? 400 : contentHeight + 100

  return (
    <View style={[styles.hero, { height: heroHeight }]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.heroTop}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.back()}>
          <BlurView intensity={40} style={styles.bubble}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9}>
          <BlurView intensity={40} style={styles.bubble}>
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
          </BlurView>
        </TouchableOpacity>
      </View>
      <BlurView
        onLayout={event => {
          const { height } = event.nativeEvent.layout
          setContentHeight(height)
        }}
        intensity={40}
        style={styles.content}
      >
        {children}
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  hero: {
    width: '90%',
    transitionProperty: 'height',
    transitionDuration: '200ms',
    margin: 'auto',
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative'
  },
  heroTop: {
    position: 'absolute',
    elevation: 1,
    top: 20,
    left: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bubble: {
    backgroundColor: 'rgba(29,29,29,0.3)',
    width: 44,
    height: 44,
    borderRadius: 22,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  content: {
    overflow: 'hidden',
    backgroundColor: 'rgba(29,29,29,0.3)',
    padding: 20,
    display: 'flex',
    gap: 10,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 15
  }
})
