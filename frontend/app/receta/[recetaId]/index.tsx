import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'
import { router, useLocalSearchParams } from 'expo-router'
import { api } from '@/services/api'
import ActionButton from '@/components/ui/ActionButton'
import Hero from '@/components/ui/Hero'
import { useReceta } from '@/contexts/RecetaContext'
import { authService } from '@/services/auth'
import { capitalize } from '@/utils'
import IngredientUtensilList from '@/components/IngredientUtensilList'

export default function RecetaScreen() {
  const { recetaId: id } = useLocalSearchParams()
  const {
    receta,
    setReceta,
    loading,
    setLoading,
    servings,
    setServings,
    isFavorite,
    toggleFavorite,
    checkFavoriteStatus
  } = useReceta()
  const [isOwner, setIsOwner] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Check if current user is the owner of the recipe
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const user = await authService.getUser()
        if (user && receta) {
          // Since the recipe user object doesn't have idUsuario, we'll compare by email for now
          setIsOwner(user.email === receta.usuario?.mail)
          setUserRole(user.rol)
        }
      } catch (error) {
        console.error('Error checking ownership:', error)
      }
    }
    checkOwnership()
  }, [receta])

  // Calculate scaled ingredients based on current servings
  const getScaledIngredients = () => {
    if (!receta || !servings) return []

    const scaleFactor = servings / receta.cantidadPersonas
    return (
      receta.ingredientes?.map((item) => ({
        ...item,
        cantidad: Math.round(item.cantidad * scaleFactor * 100) / 100 // Round to 2 decimal places
      })) || []
    )
  }

  // Calculate scaled utensils based on current servings
  const getScaledUtensils = () => {
    if (!receta || !servings) return []

    // Por ahora 1. No escalan los utencilios.
    const scaleFactor = 1
    return (
      receta.utencilios?.map((item) => ({
        ...item,
        cantidad: Math.round(item.cantidad * scaleFactor * 100) / 100 // Round to 2 decimal places
      })) || []
    )
  }

  useEffect(() => {
    if (id && !receta) {
      const recipeId = Array.isArray(id) ? id[0] : id

      api('/recipes/:id', 'GET', { params: { id: recipeId } })
        .then((res) => res.json())
        .then((data) => {
          setReceta(data)
          setServings(data.cantidadPersonas)
          setLoading(false)
          // Check favorite status after loading recipe
          checkFavoriteStatus(recipeId)
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error)
          setLoading(false)
        })
    }
  }, [id, receta, setReceta, setServings, setLoading, checkFavoriteStatus])

  const handleEditRecipe = () => {
    // Navigate to edit recipe page
    router.push(`/receta/${id}/editar`)
  }

  const handleDeleteRecipe = async () => {
    // Show confirmation dialog and delete recipe
    Alert.alert('Eliminar Receta', '¿Estás seguro de que quieres eliminar esta receta?', [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const recipeId = Array.isArray(id) ? id[0] : id
            await api('/recipes/:id', 'DELETE', { params: { id: recipeId } })
            router.back()
          } catch (error) {
            console.error('Error deleting recipe:', error)
            Alert.alert('Error', 'Error al eliminar la receta')
          }
        }
      }
    ])
  }

  if (loading) {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </CustomScreenView>
    )
  }

  if (!receta || typeof id !== 'string') {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Recipe not found</Text>
        </View>
      </CustomScreenView>
    )
  }

  return (
    <>
      <CustomScreenView style={styles.container}>
        {/* Hero Image */}
        <Hero
          image={receta.fotoPrincipal}
          state="open"
          isSaved={isFavorite}
          toggleSaved={toggleFavorite}
        >
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
            {capitalize(receta.nombreReceta)}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>
              <Text style={{ fontSize: 12, fontStyle: 'italic' }}>De</Text> {receta.usuario.nombre}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>{receta.calificacion.toFixed(1)}</Text>
              <Ionicons name="star" size={16} color="#fff" />
            </View>
          </View>
        </Hero>

        {/* Owner Actions */}
        {isOwner && (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditRecipe}>
              <Ionicons name="create-outline" size={20} color="#EE964B" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRecipe}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Resumen</Text>

        {/* Recipe Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>{receta.porciones} Porciones</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>
                {receta.pasos.length < 5 ? 'Fácil' : 'Intermedio'}
              </Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>
                {receta.cantidadPersonas} Persona{receta.cantidadPersonas > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>{receta.calificacion.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{receta.descripcionReceta}</Text>

        {/* Servings Counter */}
        <View style={styles.servingsContainer}>
          <TouchableOpacity
            style={[
              styles.servingsButton,
              styles.minusButton,
              {
                backgroundColor:
                  (servings ?? 0) <= receta.cantidadPersonas ? 'rgba(238,150,75,0.4)' : '#EE964B'
              }
            ]}
            onPress={() => servings && setServings(Math.max(receta.cantidadPersonas, servings - 1))}
          >
            <Ionicons name="remove" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.servingsDisplay}>
            <Text style={styles.servingsText}>{servings}</Text>
            <Ionicons name="person" size={20} color="#A5A5A5" />
          </View>
          <TouchableOpacity
            style={[styles.servingsButton, styles.plusButton]}
            onPress={() => servings && setServings(servings + 1)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Ingredients */}
        <IngredientUtensilList
          title="Ingredientes"
          items={getScaledIngredients()}
          servings={typeof servings === 'number' ? servings : undefined}
          originalServings={
            typeof receta.cantidadPersonas === 'number' ? receta.cantidadPersonas : undefined
          }
        />

        {/* Utensils */}
        <IngredientUtensilList
          title="Utencilios"
          items={getScaledUtensils()}
          servings={typeof servings === 'number' ? servings : undefined}
          originalServings={
            typeof receta.cantidadPersonas === 'number' ? receta.cantidadPersonas : undefined
          }
        />

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Opiniones</Text>
        {receta.calificaciones?.length > 0 ? (
          receta.calificaciones.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <Text style={styles.reviewText}>{review.comentario}</Text>
              <View style={styles.reviewFooter}>
                <View style={styles.starsContainer}>
                  {[...Array(review.calificacion)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
                <View style={styles.reviewDivider} />
                <Text style={styles.reviewAuthor}>{review.usuario?.nombre}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noReviews}>No hay opiniones aún</Text>
        )}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver todas</Text>
        </TouchableOpacity>
      </CustomScreenView>
      {userRole === 'alumno' && (
        <ActionButton onPress={() => router.push(`/receta/${id}/pasos`)}>
          <Text style={styles.startButtonText}>Empezar</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </ActionButton>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
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
    height: 120,
    backgroundColor: 'rgba(238,150,75,0.6)',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16
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
    fontSize: 16
  },
  ingredientAmount: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 32,
    marginLeft: 8,
    marginTop: 8
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginLeft: 24
  },
  servingsButton: {
    width: 48,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  minusButton: {
    backgroundColor: '#EE964B',
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
    height: '100%',
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
  },
  scaledIndicator: {
    color: '#7E7E7E',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8
  },
  horizontalList: {
    paddingHorizontal: 28,
    gap: 4
  },
  ownerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EE964B',
    borderRadius: 8,
    backgroundColor: 'rgba(238, 150, 75, 0.1)'
  },
  editButtonText: {
    color: '#EE964B',
    fontSize: 14,
    fontWeight: '600'
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)'
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600'
  }
})
