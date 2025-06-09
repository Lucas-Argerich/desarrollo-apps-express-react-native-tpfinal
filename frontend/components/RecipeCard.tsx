import React from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

interface RecipeCardProps {
  id: string
  title: string
  subtitle?: string
  time: string
  rating: string
  image: string
}

export default function RecipeCard({ id, title, subtitle, time, rating, image }: RecipeCardProps) {
  return (
    <Link href={`/receta/${id}`} asChild>
      <Pressable>
        <View style={styles.recipeCard}>
          <Image source={{ uri: image }} style={styles.recipeImage} />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>{title}</Text>
            {subtitle ? <Text style={styles.recipeSubtitle}>{subtitle}</Text> : null}
            <View style={styles.recipeMeta}>
              <Ionicons name="time-outline" size={16} color="#fff" />
              <Text style={styles.recipeMetaText}>{time}</Text>
              <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
              <Text style={styles.recipeMetaText}>{rating}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  recipeCard: {
    width: 220,
    height: 260,
    backgroundColor: '#222',
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  recipeImage: {
    width: '100%',
    height: 140
  },
  recipeInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end'
  },
  recipeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2
  },
  recipeSubtitle: {
    color: '#CAC8C8',
    fontSize: 13,
    marginBottom: 8
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  recipeMetaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 13
  }
}) 