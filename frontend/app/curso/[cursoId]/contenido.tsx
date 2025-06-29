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
        <Image source={{ uri: course.imagen ?? '' }} style={styles.courseImage} />
        <Text style={styles.sectionTitle}>Contenido</Text>
        <Text style={styles.contentDescription}>{course.descripcion}</Text>
        <View style={styles.modulesContainer}>
          {course.modulos?.map((modulo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moduleItem}
              onPress={() => router.push(`/curso/${cursoId}/modulo/${modulo.idModulo}`)}
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
  courseImage: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 16,
  },
  contentDescription: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    marginBottom: 24,
  },
  modulesContainer: {
    gap: 16,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 8,
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
  },
}); 