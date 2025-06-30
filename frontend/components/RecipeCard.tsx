import React from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Receta } from '@/utils/types'
import { BlurView } from 'expo-blur'

interface RecipeCardProps {
  recipe: Receta
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/receta/${recipe.idReceta}`} asChild>
      <Pressable>
        <View style={styles.recipeCard}>
          {/* Background Image */}
          <Image source={{ uri: recipe.fotoPrincipal }} style={styles.backgroundImage} />
          
          {/* Info Card */}
          <BlurView intensity={20} style={styles.infoCard}>
            <View style={styles.titleRow}>
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {recipe.nombreReceta}
              </Text>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.leftMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="fast-food-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>
                    <Text style={styles.metaNumber}>2</Text>
                    <Text style={styles.metaUnit}>h</Text>
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>{recipe.cantidadPersonas}</Text>
                  <Ionicons name="person-outline" size={12} color="#FFFFFF" />
                </View>
              </View>
              
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{recipe.calificacion?.toFixed(1)}</Text>
                <Ionicons name="star-outline" size={16} color="#FFFFFF" style={{ marginBottom: 2 }} />
              </View>
            </View>
          </BlurView>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  recipeCard: {
    width: 220,
    height: 305,
    position: 'relative',
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover'
  },
  avatarContainer: {
    position: 'absolute',
    top: 14,
    right: 17,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  infoCard: {
    overflow: 'hidden',
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(29,29,29,0.5)',
    borderRadius: 15,
    padding: 11,
    minHeight: 75
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11
  },
  recipeTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    lineHeight: 18
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginLeft: 4
  },
  metaNumber: {
    fontSize: 14
  },
  metaUnit: {
    fontSize: 10
  },
  ratingContainer: {
    width: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto'
  }
}) 