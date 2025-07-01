import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import { useCurso } from '../../../contexts/CursoContext'
import Hero from '@/components/ui/Hero'
import { capitalize } from '@/utils'
import { Ionicons } from '@expo/vector-icons'
import IngredientUtensilList from '@/components/IngredientUtensilList'

export default function ContenidoScreen() {
  const { course, loading, isSubscribed } = useCurso()
  const { cursoId } = useLocalSearchParams()

  if (loading)
    return (
      <CustomScreenView style={styles.container}>
        <Text>Cargando...</Text>
      </CustomScreenView>
    )
  if (!course)
    return (
      <CustomScreenView style={styles.container}>
        <Text>No se encontró el curso</Text>
      </CustomScreenView>
    )

  return (
    <CustomScreenView>
      <Hero image={course.imagen ?? 'https://picsum.photos/id/374/462'} state="closed">
        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
          {capitalize(course.titulo ?? '')}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            position: 'relative'
          }}
        >
          <View
            style={[
              {
                display: 'flex',
                flexDirection: 'row',
                gap: 4
              },
              !isSubscribed ? { position: 'absolute', top: '-80%' } : {}
            ]}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {course.calificacion?.toFixed(1) ?? '4.8'}
            </Text>
            <Ionicons name="star" size={16} color="#fff" />
          </View>
          {!isSubscribed && (
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>${course.precio}</Text>
          )}
        </View>
      </Hero>

      <View style={styles.container}>
        <View style={styles.contentHeader}>
          <Text style={styles.sectionTitle}>Contenido</Text>
        </View>

        <Text style={styles.contentDescription}>
          Clases en vivo por videoconferencia, interactúa con el instructor en tiempo real y accede
          a material digital.
        </Text>

        <View style={styles.modulesContainer}>
          {course.modulos?.map((modulo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moduleItem}
              onPress={() => router.push(`/curso/${cursoId}/${modulo.idModulo}`)}
            >
              <Text style={styles.moduleNumber}>{index + 1}.</Text>
              <Text style={styles.moduleTitle}>{capitalize(modulo.titulo ?? '')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

        {/* Ingredients */}
        {course.ingredientes && course.ingredientes.length > 0 && (
          <IngredientUtensilList
            title="Ingredientes"
            items={course.ingredientes.map((ing) => ({
              idUtilizado: (ing as any).idUtilizado ?? 0,
              nombre: (ing as any).nombre ?? '',
              cantidad: (ing as any).cantidad ?? 1,
              unidad: (ing as any).unidad ?? 'u',
              observaciones: (ing as any).observaciones ?? ''
            }))}
          />
        )}

        {/* Utensils */}
        {course.utencilios && course.utencilios.length > 0 && (
          <IngredientUtensilList
            title="Utencilios"
            items={course.utencilios.map((ut) => ({
              idUtilizado: (ut as any).idUtilizado ?? 0,
              nombre: (ut as any).nombre ?? '',
              cantidad: (ut as any).cantidad ?? 1,
              unidad: (ut as any).unidad ?? 'u',
              observaciones: (ut as any).observaciones ?? ''
            }))}
          />
        )}
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 28
  },
  spacer: {
    width: 100,
    height: 12,
    backgroundColor: '#FFFFFF'
  },
  courseImage: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
    marginBottom: 16
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B'
  },
  contentDescription: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    marginBottom: 12
  },
  modulesContainer: {
    gap: 12
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8
  },
  moduleNumber: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5'
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5'
  }
})
