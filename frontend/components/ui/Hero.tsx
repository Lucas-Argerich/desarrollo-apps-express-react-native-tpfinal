import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

type HeroProps = {
  image: string
  state: 'open' | 'closed'
  children: React.ReactNode
} & (
  | { isSaved: undefined; toggleSaved: undefined }
  | {
      isSaved: boolean
      toggleSaved: () => Promise<void>
    }
)

export default function Hero({ image, state, isSaved, toggleSaved, children }: HeroProps) {
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [contentHeight, setContentHeight] = useState(200)
  const heroHeight = state === 'open' ? 400 : contentHeight + 100

  const handleToggle = () => {
    if (isLoadingSave || !toggleSaved) return
    setIsLoadingSave(true)

    toggleSaved().finally(() => setIsLoadingSave(false))
  }

  return (
    <View style={[styles.hero, { height: heroHeight }]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.heroTop}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.back()}>
          <BlurView intensity={40} style={styles.bubble}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        {isSaved !== undefined && (
          <TouchableOpacity activeOpacity={0.9} onPress={handleToggle} disabled={isLoadingSave}>
            <BlurView intensity={40} style={styles.bubble}>
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color="#fff" />
            </BlurView>
          </TouchableOpacity>
        )}
      </View>
      <BlurView
        onLayout={(event) => {
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
