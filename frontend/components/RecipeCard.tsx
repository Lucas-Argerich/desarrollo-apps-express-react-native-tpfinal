import React from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Receta } from '@/utils/types'

interface RecipeCardProps {
  recipe: Receta
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/receta/${recipe.idReceta}`} asChild>
      <Pressable>
        <View style={styles.recipeCard}>
          <Image source={{ uri: recipe.fotoPrincipal }} style={styles.recipeImage} />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>{recipe.nombreReceta}</Text>
            {recipe.descripcionReceta ? <Text style={styles.recipeSubtitle}>{recipe.descripcionReceta}</Text> : null}
            <View style={styles.recipeMetaContainer}>
              <View style={styles.recipeMeta}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={styles.recipeMetaText}>{recipe.porciones} porciones</Text>
              </View>
              <View style={styles.recipeMeta}>
                <Text style={styles.recipeMetaText}>{recipe.calificacion?.toFixed(1)}</Text>
                <Ionicons name="star" size={16} color="#fff" style={{ marginLeft: 2, marginBottom: 2 }} />
              </View>
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
  recipeMetaContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
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