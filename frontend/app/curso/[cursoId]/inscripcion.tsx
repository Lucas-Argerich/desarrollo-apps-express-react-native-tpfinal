import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'
import Hero from '@/components/ui/Hero'
import Select from '@/components/ui/Select'
import { useLocalSearchParams, router } from 'expo-router'
import { api } from '@/services/api'
import { Cronograma } from '@/utils/types'
import { capitalize } from '@/utils'
import { useCurso } from '../../../contexts/CursoContext'

const Page = () => {
  const { course, user, loading } = useCurso();
  const { cursoId } = useLocalSearchParams()
  const [cronograma, setCronograma] = useState<Cronograma[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (cursoId && typeof cursoId === 'string') {
          // Get course data
          const courseResponse = await api('/courses/:id', 'GET', { params: { id: cursoId } })
          const courseData = await courseResponse.json()
          setCronograma(courseData.cronogramas)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [cursoId])

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para inscribirte en el curso')
      return
    }

    if (cronograma.length > 0 && !selectedSchedule) {
      Alert.alert('Error', 'Debes seleccionar un horario para inscribirte')
      return
    }

    setEnrolling(true)
    try {
      const courseId = Array.isArray(cursoId) ? cursoId[0] : cursoId
      const res = await api('/courses/:id/register', 'POST', { params: { id: courseId }, 
        data: {
          idCronograma: parseInt(selectedSchedule)
        } 
      })
      if (!res.ok) {
        throw (await res.json())
      }
      Alert.alert('Éxito', 'Te has inscrito correctamente en el curso', [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (error) {
      console.error('Error enrolling:', error)
      Alert.alert('Error', 'No se pudo inscribir en el curso')
    } finally {
      setEnrolling(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading)
    return (
      <CustomScreenView>
        <Text>Cargando...</Text>
      </CustomScreenView>
    )
  if (!course)
    return (
      <CustomScreenView>
        <Text>No se encontró el curso</Text>
      </CustomScreenView>
    )

  return (
    <>
      <CustomScreenView style={styles.container}>
        {/* Course Hero */}
        <Hero image={course.imagen ?? 'https://picsum.photos/id/374/462'} state="closed">
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>
            {capitalize(course.titulo ?? '')}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4, position: 'absolute', top: '-80%' }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {course.calificacion?.toFixed(1) ?? '4.8'}
              </Text>
              <Ionicons name="star" size={16} color="#fff" />
            </View>
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: 500 }}>${course.precio}</Text>
          </View>
        </Hero>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <Text style={styles.activeTab}>Inscripción</Text>
            <Text style={styles.inactiveTab}>Detalles</Text>
          </View>

          {/* Modalidad Section */}
          <View style={styles.modalidadContainer}>
            <Text style={styles.modalidadLabel}>Modalidad</Text>
            <Text style={styles.modalidadValue}>{course.modalidad || 'Virtual'}</Text>
          </View>

          {/* Duración Section */}
          {course.duracion && (
            <View style={styles.modalidadContainer}>
              <Text style={styles.modalidadLabel}>Carga Horaria</Text>
              <Text style={[styles.modalidadValue, { fontSize: 18 }]}>{course.duracion} min. por Semana</Text>
            </View>
          )}

                      {/* Dificultad Section */}
            {course.dificultad && (
              <View style={styles.modalidadContainer}>
                <Text style={styles.modalidadLabel}>Dificultad</Text>
                <Text style={styles.modalidadValue}>{course.dificultad}</Text>
              </View>
            )}

            {/* Cronograma Section */}
            {cronograma.length > 0 && (
              <View style={styles.cronogramaContainer}>
                <Text style={styles.cronogramaLabel}>Horarios Disponibles</Text>
                <Select
                  value={selectedSchedule}
                  options={cronograma.map(c => c.idCronograma.toString())}
                  onSelect={setSelectedSchedule}
                  placeholder="Selecciona un horario"
                  style={{
                    field: {
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1,
                      borderColor: '#E1E1E1',
                      borderRadius: 12,
                      height: 56,
                      paddingHorizontal: 20
                    },
                    fieldText: {
                      color: selectedSchedule ? '#1B1B1B' : '#7E7E7E',
                      fontSize: 16,
                      fontFamily: 'Roboto',
                      fontWeight: '500'
                    }
                  }}
                  renderLabel={(id) => {
                    const c = cronograma.find(cr => cr.idCronograma.toString() === id)
                    if (!c || !c.fechaInicio || !c.fechaFin) return 'Horario no disponible'
                    const startDate = new Date(c.fechaInicio).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                    const endDate = new Date(c.fechaFin).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                    const sede = c.sede ? ` - ${c.sede.nombreSede}` : ''
                    const vacantes = c.vacantesDisponibles ? ` (${c.vacantesDisponibles} vacantes)` : ''
                    return `${startDate} - ${endDate}${sede}${vacantes}`
                  }}
                />
              </View>
            )}

          {/* Contenidos Section */}
          {course.contenidos && (
            <View style={styles.contenidosContainer}>
              <Text style={styles.contenidosLabel}>Contenidos</Text>
              <Text style={styles.contenidosValue}>{course.contenidos}</Text>
            </View>
          )}

          {/* Requerimientos Section */}
          {course.requerimientos && (
            <View style={styles.requerimientosContainer}>
              <Text style={styles.requerimientosLabel}>Requerimientos</Text>
              <Text style={styles.requerimientosValue}>{course.requerimientos}</Text>
            </View>
          )}

          {/* Información de Pago Section */}
          <Text style={styles.paymentTitle}>Información de Pago</Text>

          <View style={styles.paymentContainer}>
            <Text style={styles.paymentLabel}>Tarjeta de Credito</Text>
            <TouchableOpacity style={styles.paymentDropdown} activeOpacity={0.7}>
              <View style={styles.paymentContent}>
                <Ionicons name="card-outline" size={24} />
                <Text style={styles.cardText}>**** **** **** 1234</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#7E7E7E" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action Buttons */}
      </CustomScreenView>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll} disabled={enrolling}>
          <Text style={styles.enrollButtonText}>
            {enrolling ? 'Inscribiendo...' : 'Inscribirse'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 100
  },
  scrollContent: {
    padding: 28
  },
  spacer: {
    width: 100,
    height: 12,
    backgroundColor: '#FFFFFF'
  },
  heroTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 32
  },
  activeTab: {
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B'
  },
  inactiveTab: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: 'rgba(27,27,27,0.62)'
  },
  modalidadContainer: {
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16
  },
  modalidadLabel: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#7E7E7E',
    textAlign: 'center'
  },
  modalidadValue: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    textAlign: 'center'
  },
  cronogramaContainer: {
    marginBottom: 32
  },
  cronogramaLabel: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 12
  },
  precioContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12
  },
  precioLabel: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#7E7E7E',
    textAlign: 'center'
  },
  precioValue: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    textAlign: 'center'
  },
  contenidosContainer: {
    marginBottom: 32
  },
  contenidosLabel: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 12
  },
  contenidosValue: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#7E7E7E',
    lineHeight: 24
  },
  requerimientosContainer: {
    marginBottom: 32
  },
  requerimientosLabel: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 12
  },
  requerimientosValue: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#7E7E7E',
    lineHeight: 24
  },
  modulosContainer: {
    marginBottom: 32
  },
  modulosLabel: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 16
  },
  moduloItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  moduloNumber: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#EE964B',
    marginRight: 12,
    minWidth: 20
  },
  moduloContent: {
    flex: 1
  },
  moduloTitle: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#1B1B1B',
    marginBottom: 4
  },
  moduloDuracion: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#7E7E7E'
  },

  paymentTitle: {
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 24,
    marginTop: 24,
  },
  paymentContainer: {
    gap: 12,
    marginBottom: 32
  },
  paymentLabel: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 8
  },
  paymentDropdown: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF'
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  cardIcon: {
    width: 44,
    height: 32,
    resizeMode: 'cover',
    borderRadius: 4
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#1B1B1B'
  },
  actionButtons: {
    position: 'absolute',
    bottom: 38,
    left: 28,
    right: 28,
    flexDirection: 'row',
    gap: 12
  },
  backButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    height: 66,
    borderWidth: 1,
    borderColor: '#E1E1E1'
  },
  backButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#7E7E7E'
  },
  enrollButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#EE964B',
    borderRadius: 16,
    height: 66,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  enrollButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#FFFFFF'
  }
})
