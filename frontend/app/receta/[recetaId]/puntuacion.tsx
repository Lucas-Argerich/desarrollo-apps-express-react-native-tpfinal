import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'
import { router } from 'expo-router'
import { useReceta } from '@/contexts/RecetaContext'
import Hero from '@/components/ui/Hero'
import { api } from '@/services/api'
import { capitalize } from '@/utils'

export default function RecetaPuntuacionScreen() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const { receta, isFavorite, toggleFavorite } = useReceta()

  const handlePublishReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación')
      return
    }

    if (!receta) {
      Alert.alert('Error', 'No hay datos de receta disponibles')
      return
    }

    setIsPublishing(true)

    try {
      const response = await api('/recipes/:id/reviews', 'POST', {
        params: { id: receta.idReceta },
        data: {
          calificacion: rating,
          comentarios: comment.trim() || null
        }
      })

      if (response.ok) {
        Alert.alert(
          '¡Reseña publicada!',
          'Gracias por compartir tu experiencia',
          [
            {
              text: 'Volver al Inicio',
              onPress: () => router.dismissTo('/')
            }
          ]
        )
      } else {
        const errorData = await response.json()
        Alert.alert('Error', errorData.error || 'Error al publicar la reseña')
      }
    } catch (error) {
      console.error('Error publishing review:', error)
      Alert.alert('Error', 'No se pudo publicar la reseña. Intenta nuevamente.')
    } finally {
      setIsPublishing(false)
    }
  }

  if (!receta) {
    return (
      <CustomScreenView>
        <Text>No recipe data available</Text>
      </CustomScreenView>
    )
  }

  return (
    <CustomScreenView>
      <Hero image={receta.fotoPrincipal} state="closed" isSaved={isFavorite} toggleSaved={toggleFavorite}>
        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>{capitalize(receta.nombreReceta)}</Text>
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
      {/* Completion Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.completionTitle}>¡Receta Completada!</Text>
        <Text style={styles.completionSubtitle}>
          ¿Cómo estuvo tu experiencia preparando {capitalize(receta.nombreReceta)}?
        </Text>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Calificá tu experiencia:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={star <= rating ? '#EE964B' : '#E1E1E1'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comment Section */}
      <View style={styles.commentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Haz un comentario..."
          placeholderTextColor="#848282"
          multiline
          value={comment}
          onChangeText={setComment}
          maxLength={500}
        />
        <Text style={styles.characterCount}>{comment.length}/500</Text>
      </View>

      {/* Publish Button */}
      <TouchableOpacity 
        style={[styles.publishButton, isPublishing && styles.publishButtonDisabled]}
        onPress={handlePublishReview}
        disabled={isPublishing}
      >
        <Text style={styles.publishButtonText}>
          {isPublishing ? 'Publicando...' : 'Publicar Reseña'}
        </Text>
        {isPublishing && (
          <View style={styles.loadingSpinner}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => router.dismissTo('/')}
          disabled={isPublishing}
        >
          <Text style={styles.actionButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.dismissAll()}
          disabled={isPublishing}
        >
          <Text style={styles.actionButtonText}>Rehacer la Receta</Text>
        </TouchableOpacity>
      </View>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 28
  },
  recipeImage: {
    width: '100%',
    height: 243,
    resizeMode: 'cover',
    marginBottom: 12
  },
  headerContainer: {
    margin: 24
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 8
  },
  completionSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5'
  },
  ratingContainer: {
    marginBottom: 24
  },
  ratingTitle: {
    fontSize: 21,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#1B1B1B',
    marginBottom: 16,
    marginHorizontal: 24
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 24
  },
  starButton: {
    padding: 4
  },
  commentContainer: {
    height: 93,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#9A9A9A',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
    marginHorizontal: 24
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#848282',
    textAlignVertical: 'top'
  },
  characterCount: {
    alignSelf: 'flex-end',
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#848282'
  },
  publishButton: {
    backgroundColor: '#EE964B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9
    },
    shadowOpacity: 0.15,
    shadowRadius: 19,
    elevation: 5,
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  publishButtonDisabled: {
    backgroundColor: '#E1E1E1'
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginHorizontal: 24
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#CAC8C8',
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  loadingSpinner: {
    marginLeft: 8
  }
})
