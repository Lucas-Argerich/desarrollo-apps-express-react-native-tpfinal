import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'
import { useLocalSearchParams } from 'expo-router'
import { api } from '@/services/api'
import { Receta } from '@/utils/types'

export default function RecetaScreen() {
  const { recetaId: id } = useLocalSearchParams()
  const [servings, setServings] = useState(1)
  const [recipe, setRecipe] = useState<Receta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const recipeId = Array.isArray(id) ? id[0] : id

      api('/recipes/:id', 'GET', { params: { id: recipeId } })
        .then((res) => res.json())
        .then((data) => {
          setRecipe(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error)
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </CustomScreenView>
    )
  }

  if (!recipe) {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Recipe not found</Text>
        </View>
      </CustomScreenView>
    )
  }

  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View>
          <Image source={{ uri: recipe.fotoPrincipal }} style={styles.heroImage} />
          <View
            style={{
              backgroundColor: '#acacac',
              padding: 20,
              display: 'flex',
              gap: 10,
              position: 'absolute',
              bottom: 20,
              width: '90%',
              right: '50%',
              transform: [{ translateX: '50%' }],
              borderRadius: 15
            }}
          >
            <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
              {recipe.nombreReceta}
            </Text>
            <View
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>
                <Text style={{ fontSize: 12, fontStyle: 'italic' }}>De</Text>{' '}
                {recipe.usuario.nombre}
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>{recipe.calificaciones.length}</Text>
                <Ionicons name="star" size={16} color="#fff" />
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Resumen</Text>

        {/* Recipe Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>{recipe.porciones} porciones</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>fácil</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>
                {recipe.cantidadPersonas} persona{recipe.cantidadPersonas > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>{recipe.calificaciones?.length}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{recipe.descripcionReceta}</Text>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.ingredientsGrid}>
          {recipe.utilizados
            ?.filter((item) => item.ingrediente)
            .map((item) => (
              <View key={item.idUtilizado} style={styles.ingredientCard}>
                <Image
                  source={{ uri: 'https://picsum.photos/113/93' }}
                  style={styles.ingredientImage}
                />
                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientName}>{item.ingrediente?.nombre}</Text>
                  <Text style={styles.ingredientAmount}>
                    {item.cantidad} {item.unidad.descripcion}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Utencilios</Text>
        <View style={styles.ingredientsGrid}>
          {recipe.utilizados
            ?.filter((item) => item.utencilio)
            .map((item) => (
              <View key={item.idUtilizado} style={styles.ingredientCard}>
                <Image
                  source={{ uri: 'https://picsum.photos/113/93' }}
                  style={styles.ingredientImage}
                />
                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientName}>{item.ingrediente?.nombre}</Text>
                  <Text style={styles.ingredientAmount}>
                    {item.cantidad} {item.unidad.descripcion}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Servings Counter */}
        <View style={styles.servingsContainer}>
          <TouchableOpacity
            style={[styles.servingsButton, styles.minusButton]}
            onPress={() => setServings(Math.max(1, servings - 1))}
          >
            <Ionicons name="remove" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.servingsDisplay}>
            <Text style={styles.servingsText}>{servings}</Text>
            <Ionicons name="person" size={20} color="#A5A5A5" />
          </View>
          <TouchableOpacity
            style={[styles.servingsButton, styles.plusButton]}
            onPress={() => setServings(servings + 1)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Opiniones</Text>
        {recipe.calificaciones?.length > 0 ? (
          recipe.calificaciones.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <Text style={styles.reviewText}>Review {index + 1}</Text>
              <View style={styles.reviewFooter}>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
                <View style={styles.reviewDivider} />
                <Text style={styles.reviewAuthor}>Usuario</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noReviews}>No hay opiniones aún</Text>
        )}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver todas</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Empezar</Text>
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  heroImage: {
    width: '100%',
    height: 374,
    resizeMode: 'cover'
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingTop: 28,
    gap: 16
  },
  tab: {
    paddingVertical: 8
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1B1B1B'
  },
  tabText: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: 'rgba(27,27,27,0.62)'
  },
  activeTabText: {
    color: '#1B1B1B'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24
  },
  infoColumn: {
    gap: 24
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  iconContainer: {
    width: 34,
    height: 34,
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#7E7E7E'
  },
  description: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    paddingHorizontal: 28,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    paddingHorizontal: 28,
    marginBottom: 16,
    marginTop: 36
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 28,
    gap: 16,
    marginBottom: 24
  },
  ingredientCard: {
    width: 113,
    height: 177,
    backgroundColor: 'rgba(238,150,75,0.6)',
    borderRadius: 16,
    overflow: 'hidden'
  },
  ingredientImage: {
    width: '100%',
    height: 93,
    resizeMode: 'cover'
  },
  ingredientInfo: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-between'
  },
  ingredientName: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 14
  },
  ingredientAmount: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  servingsButton: {
    width: 48,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  minusButton: {
    backgroundColor: 'rgba(238,150,75,0.4)',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  plusButton: {
    backgroundColor: '#EE964B',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  servingsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1'
  },
  servingsText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#A5A5A5'
  },
  reviewCard: {
    marginHorizontal: 28,
    padding: 21,
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 12,
    marginBottom: 16
  },
  reviewText: {
    color: '#A5A5A5',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 12
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4
  },
  reviewDivider: {
    width: 12,
    height: 1,
    backgroundColor: '#7E7E7E',
    marginHorizontal: 8
  },
  reviewAuthor: {
    color: '#7E7E7E',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14
  },
  viewAllButton: {
    paddingHorizontal: 28,
    marginBottom: 100
  },
  viewAllText: {
    color: 'rgba(27,27,27,0.62)',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16
  },
  startButton: {
    position: 'absolute',
    bottom: 38,
    left: 28,
    right: 28,
    height: 66,
    backgroundColor: '#EE964B',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 13
    },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 5
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noReviews: {
    color: '#A5A5A5',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 12
  }
})
