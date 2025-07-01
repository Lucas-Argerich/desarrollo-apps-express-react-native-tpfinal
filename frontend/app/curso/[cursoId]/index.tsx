import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import { api } from '@/services/api'
import { Curso } from '@/utils/types'
import CourseCard from '@/components/CourseCard'
import ActionButton from '@/components/ui/ActionButton'
import { Ionicons } from '@expo/vector-icons'
import Hero from '@/components/ui/Hero'
import { capitalize } from '@/utils'
import { authService } from '@/services/auth'

export default function CursoScreen() {
  const { cursoId } = useLocalSearchParams()
  const [course, setCourse] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Curso[] | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userData = await authService.getUser()
        setUser(userData)

        if (cursoId && typeof cursoId === 'string') {
          // Get course data
          const courseResponse = await api('/courses/:id', 'GET', { params: { id: cursoId } })
          const courseData = await courseResponse.json()
          setCourse(courseData)

          // Check if user is enrolled
          if (userData) {
            try {
              const enrolledResponse = await api('/courses/user/subscribed', 'GET')
              const enrolledCourses = await enrolledResponse.json()
              const enrolled = enrolledCourses.some((c: any) => c.idCurso === courseData.idCurso)
              setIsEnrolled(enrolled)

              // Check if user is the owner
              setIsOwner(
                userData.id === courseData.idUsuario || userData.email === courseData.usuario?.mail
              )
            } catch (error) {
              console.log('Error checking enrollment:', error)
            }
          }
        }

        // Get related courses
        const relatedResponse = await api('/courses', 'GET', { query: { limit: 3 } })
        const relatedData = await relatedResponse.json()
        setRelated(relatedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [cursoId])

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para inscribirte en el curso')
      return
    }

    // Navigate to enrollment screen instead of direct enrollment
    router.push(`/curso/${cursoId}/inscripcion`)
  }

  const handleEditCourse = () => {
    router.push(`/curso/${cursoId}/editar`)
  }

  const handleDeleteCourse = async () => {
    Alert.alert('Eliminar Curso', '¿Estás seguro de que quieres eliminar este curso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const recipeId = Array.isArray(cursoId) ? cursoId[0] : cursoId
            await api('/courses/:id', 'DELETE', { params: { id: recipeId } })
            Alert.alert('Éxito', 'Curso eliminado correctamente')
            router.back()
          } catch (error) {
            console.error('Error deleting course:', error)
            Alert.alert('Error', 'No se pudo eliminar el curso')
          }
        }
      }
    ])
  }

  if (loading)
    return (
      <CustomScreenView>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </CustomScreenView>
    )
  if (!course)
    return (
      <CustomScreenView>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No se encontró el curso</Text>
        </View>
      </CustomScreenView>
    )

  return (
    <>
      <CustomScreenView>
        <Hero image={course.imagen ?? 'https://picsum.photos/id/374/462'}>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
            {capitalize(course.titulo ?? '')}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {course.calificacion?.toFixed(1) ?? '4.8'}
              </Text>
              <Ionicons name="star" size={16} color="#fff" />
            </View>
          </View>
        </Hero>

        {/* Owner Actions */}
        {isOwner && (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditCourse}>
              <Ionicons name="create-outline" size={20} color="#EE964B" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCourse}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <Text style={styles.tabActive}>Resumen</Text>
          <Text style={styles.tabInactive}>Detalles</Text>
        </View>

        {/* Info row (match RecetaScreen style) */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>
                {course.duracion ? `${course.duracion} semanas` : '6 semanas'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>2 horas/semana</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>{course.dificultad || 'intermedio'}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>{course.calificacion?.toFixed(1) || '4.8'}</Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.description}>
          {course.descripcion ||
            'Aprende desde cero las técnicas esenciales de la panadería artesanal. Descubre cómo hacer panes crujientes, esponjosos y llenos de sabor utilizando ingredientes naturales y procesos tradicionales.'}
        </Text>

        {/* Contenido */}
        <View style={styles.tabsRow}>
          <Text style={styles.sectionTitle}>Contenido</Text>
        </View>
        <Text style={styles.contentDescription}>
          Clases en vivo por videoconferencia, interactúa con el instructor en tiempo real y accede
          a material digital.
        </Text>
        <View style={styles.modulesList}>
          {course.modulos?.map((modulo, index) => (
            <View key={index} style={styles.moduleItem}>
              <Text style={styles.moduleNumber}>{index + 1}.</Text>
              <Text style={styles.moduleTitle}>{modulo.titulo}</Text>
            </View>
          ))}
        </View>

        {/* Cursos Relacionados */}
        <View style={styles.relatedHeaderRow}>
          <Text style={styles.relatedTitle}>Cursos Relacionados</Text>
          <Text style={styles.relatedSeeMore}>Ver mas</Text>
        </View>
        <FlatList
          data={related || []}
          keyExtractor={(item, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 32, gap: 28 }}
          renderItem={({ item }) => <CourseCard item={item} />}
          style={{ marginLeft: 16 }}
        />
      </CustomScreenView>

      {/* Conditional Action Button */}
      {!isOwner && !isEnrolled && user?.rol !== 'profesor' && (
        <ActionButton onPress={handleEnroll}>
          <Text style={styles.enrollBtnText}>Inscribirse</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </ActionButton>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center'
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
  },
  topBar: {
    width: 100,
    height: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginVertical: 8
  },
  courseImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    resizeMode: 'cover',
    marginBottom: 12
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginVertical: 16,
    paddingHorizontal: 16
  },
  tabActive: {
    color: '#1B1B1B',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600'
  },
  tabInactive: {
    color: 'rgba(27,27,27,0.62)',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600'
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 12,
    marginLeft: 4,
    paddingHorizontal: 16
  },
  infoColumn: {
    flex: 1,
    gap: 24
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8
  },
  iconContainer: {
    width: 34,
    height: 34,
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  infoText: {
    color: '#7E7E7E',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  description: {
    color: '#A5A5A5',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 18,
    marginTop: 12,
    marginHorizontal: 16
  },
  sectionTitle: {
    color: '#1B1B1B',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginHorizontal: 16,
    marginVertical: 12
  },
  contentDescription: {
    color: '#A5A5A5',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 18,
    marginHorizontal: 16
  },
  modulesList: {
    gap: 12,
    marginBottom: 18,
    marginHorizontal: 16
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    marginBottom: 6
  },
  moduleNumber: {
    color: '#A5A5A5',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginRight: 8
  },
  moduleTitle: {
    flex: 1,
    color: '#A5A5A5',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  relatedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 16,
    marginHorizontal: 16
  },
  relatedTitle: {
    color: '#2F2F2F',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Roboto'
  },
  relatedSeeMore: {
    color: '#888888',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 14
  },
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center'
  }
})
