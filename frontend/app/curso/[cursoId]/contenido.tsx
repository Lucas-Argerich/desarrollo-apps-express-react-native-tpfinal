import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import { api } from '@/services/api'
import { Curso } from '@/utils/types'

export default function CursoContenidoScreen() {
  const { cursoId } = useLocalSearchParams()
  const [course, setCourse] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cursoId && typeof cursoId === 'string') {
      api('/courses/:id', 'GET', { params: { id: cursoId } })
        .then(async (res) => {
          const data = await res.json()
          setCourse(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [cursoId])

  if (loading) return <CustomScreenView style={styles.container}><Text>Cargando...</Text></CustomScreenView>
  if (!course) return <CustomScreenView style={styles.container}><Text>No se encontró el curso</Text></CustomScreenView>

  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.spacer} />
        
        <Image 
          source={{ uri: course.imagen ?? 'https://picsum.photos/id/374/210' }} 
          style={styles.courseImage} 
        />
        
        <View style={styles.contentHeader}>
          <Text style={styles.sectionTitle}>Contenido</Text>
        </View>
        
        <Text style={styles.contentDescription}>
          Clases en vivo por videoconferencia, interactúa con el instructor en tiempo real y accede a material digital.
        </Text>
        
        <View style={styles.modulesContainer}>
          {course.modulos?.map((modulo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moduleItem}
              onPress={() => router.push(`/curso/${cursoId}/${modulo.idModulo}`)}
            >
              <Text style={styles.moduleNumber}>{index + 1}.</Text>
              <Text style={styles.moduleTitle}>{modulo.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 28,
  },
  spacer: {
    width: 100,
    height: 12,
    backgroundColor: '#FFFFFF',
  },
  courseImage: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
  },
  contentDescription: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    marginBottom: 12,
  },
  modulesContainer: {
    gap: 12,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
  },
  moduleNumber: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
  },
}); 