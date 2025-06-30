import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'
import { router } from 'expo-router'
import { useReceta } from '@/contexts/RecetaContext'
import Hero from '@/components/ui/Hero'
import ActionButton from '@/components/ui/ActionButton'

export default function RecetaPasosScreen() {
  const { receta, isFavorite, toggleFavorite } = useReceta()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  if (!receta) {
    return (
      <CustomScreenView style={styles.container}>
        <Text>No recipe data available</Text>
      </CustomScreenView>
    )
  }

  // Sort steps by nroPaso to ensure correct order
  const sortedSteps = receta.pasos?.sort((a, b) => (a.nroPaso || 0) - (b.nroPaso || 0)) || []
  const currentStep = sortedSteps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === sortedSteps.length - 1

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  // If no steps available, show a message
  if (sortedSteps.length === 0) {
    return (
      <CustomScreenView style={styles.container}>
        <Hero image={receta.fotoPrincipal} state="closed" isSaved={isFavorite} toggleSaved={toggleFavorite}>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
            {receta.nombreReceta}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>
              <Text style={{ fontSize: 12, fontStyle: 'italic' }}>De</Text> {receta.usuario.nombre}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>{receta.calificaciones.length}</Text>
              <Ionicons name="star" size={16} color="#fff" />
            </View>
          </View>
        </Hero>

        <View style={styles.noStepsContainer}>
          <Text style={styles.noStepsText}>No hay pasos disponibles para esta receta</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </CustomScreenView>
    )
  }

  return (
    <>
      <CustomScreenView style={styles.container}>
        <Hero image={receta.fotoPrincipal} state="closed" isSaved={isFavorite} toggleSaved={toggleFavorite}>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
            {receta.nombreReceta}
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

        {/* Step Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Paso {currentStepIndex + 1} de {sortedSteps.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStepIndex + 1) / sortedSteps.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Navigation Header */}
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            style={[styles.navButton, isFirstStep && styles.navButtonDisabled]}
            onPress={goToPreviousStep}
          >
            <Ionicons name="chevron-back" size={24} color={isFirstStep ? '#C5C5C5' : '#1B1B1B'} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Paso {currentStep?.nroPaso || currentStepIndex + 1}</Text>
          <TouchableOpacity style={styles.navButton} onPress={goToNextStep}>
            <Ionicons name="chevron-forward" size={24} color={isLastStep ? '#C5C5C5' : '#1B1B1B'} />
          </TouchableOpacity>
        </View>

        {/* Step Description */}
        <Text style={styles.stepDescription}>
          {currentStep?.texto || 'Descripción del paso no disponible'}
        </Text>

        {/* Step Image (if available) */}
        {currentStep?.multimedia && currentStep.multimedia.length > 0 && (
          <View style={styles.stepImageContainer}>
            <Image
              source={{
                uri: currentStep.multimedia[0].urlContenido || 'https://picsum.photos/243/243'
              }}
              style={styles.stepImage}
            />
          </View>
        )}

        {/* Ingredients Section */}
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.ingredientsGrid}>
          {receta.ingredientes?.map((item) => (
            <View key={item.idUtilizado} style={styles.ingredientCard}>
              <Image
                source={{ uri: 'https://picsum.photos/113/93' }}
                style={styles.ingredientImage}
              />
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>{item.nombre}</Text>
                <Text style={styles.ingredientAmount}>
                  {item.cantidad} {item.unidad}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </CustomScreenView>
      {isLastStep && (
        <ActionButton onPress={() => router.replace(`/receta/${receta.idReceta}/puntuacion`)}>
          <Text style={{ fontSize: 20, fontWeight: 500, color: '#fff', fontFamily: 'Roboto' }}>
            Terminar y puntuar
          </Text>
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
  stepImage: {
    width: '100%',
    height: 243,
    resizeMode: 'cover'
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navButtonDisabled: {
    opacity: 0.5
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B'
  },
  stepDescription: {
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
    marginBottom: 16
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
  progressContainer: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#A5A5A5',
    marginBottom: 8
  },
  progressBar: {
    height: 8,
    backgroundColor: '#C5C5C5',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#333333'
  },
  noStepsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noStepsText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    marginBottom: 24
  },
  backButton: {
    padding: 16,
    backgroundColor: '#333333',
    borderRadius: 8
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FFFFFF'
  },
  stepImageContainer: {
    width: '100%',
    height: 243,
    marginBottom: 24
  }
})
