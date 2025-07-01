import React from 'react'
import { useCurso } from '../../../contexts/CursoContext'
import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import Hero from '@/components/ui/Hero'
import { capitalize } from '@/utils'
import { Ionicons } from '@expo/vector-icons'

const Page = () => {
  const { course, loading, isSubscribed } = useCurso()
  const { moduloId } = useLocalSearchParams()

  if (Array.isArray(moduloId)) return

  const modulo = course?.modulos?.find((m: any) => m.idModulo === parseInt(moduloId))

  if (loading)
    return (
      <CustomScreenView>
        <Text>Cargando...</Text>
      </CustomScreenView>
    )

  if (!course) {
    return (
      <CustomScreenView>
        <Text>No se encontró el curso</Text>
      </CustomScreenView>
    )
  }

  if (!modulo)
    return (
      <CustomScreenView>
        <Text>No se encontró el módulo</Text>
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
      <View style={{ marginHorizontal: 24 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.moduleTitle}>{modulo.titulo}</Text>
        </View>
        {/* Duration */}
        <Text style={styles.duration}>Duración estimada: {modulo.duracion ?? 20} minutos</Text>
        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Contenido</Text>
          <Text style={styles.contentText}>{modulo.contenido || 'Sin contenido.'}</Text>
        </View>
      </View>
      {/* Quote */}
    </CustomScreenView>
  )
}

export default Page

const styles = StyleSheet.create({
  moduleImage: {
    width: 205,
    height: 205,
    resizeMode: 'cover',
    marginBottom: 12
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginTop: 24
  },
  moduleTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B'
  },
  duration: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    marginBottom: 16
  },
  quote: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#A5A5A5',
    letterSpacing: 0.5,
    marginBottom: 24
  },
  contentContainer: {
    gap: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#3F3F3F'
  },
  contentText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 20
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 24
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1'
  },
  nextButton: {
    backgroundColor: '#1B1B1B'
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#1B1B1B'
  },
  nextButtonText: {
    color: '#FFFFFF'
  }
})
