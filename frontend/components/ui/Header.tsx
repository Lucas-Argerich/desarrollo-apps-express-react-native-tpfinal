import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { authService, User } from '@/services/auth'
import { Link } from 'expo-router'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    if (user) return

    authService.getUser().then((u) => setUser(u))
  }, [user])

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Link href="/perfil">
        <View style={styles.profile}>
          {user ? (
            user.avatar ? (
              <Image source={{ uri: user.avatar ?? '' }} />
            ) : (
              <Ionicons name="person-outline" size={24} color="#EE964B" />
            )
          ) : (
            <Ionicons name="log-in-outline" size={32} color="#EE964B" />
          )}
        </View>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8
  },
  leftContent: {
    flex: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F'
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 2
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FAF0CA',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
