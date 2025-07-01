import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Button
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import { api } from '@/services/api'
import { Curso } from '@/utils/types'
import CourseCard from '@/components/CourseCard'
import ActionButton from '@/components/ui/ActionButton'
import { Ionicons } from '@expo/vector-icons'
import Hero from '@/components/ui/Hero'
import { capitalize } from '@/utils'
import { useCurso } from '../../../contexts/CursoContext'
import IngredientUtensilList from '@/components/IngredientUtensilList'
import QRCode from 'react-native-qrcode-svg'
import { CameraView, Camera } from 'expo-camera'

const Page = () => {
  const { course, user, isSubscribed, isCreator, loading } = useCurso()
  const { cursoId } = useLocalSearchParams()
  const [related, setRelated] = useState<Curso[] | null>(null)
  const [qrModalVisible, setQrModalVisible] = useState(false)
  const [scannerVisible, setScannerVisible] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)

  // For QR code, encode courseId (or a unique attendance code if you want)
  const qrValue = JSON.stringify({ courseId: course?.idCurso })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get related courses
        const relatedResponse = await api('/courses', 'GET', { query: { limit: 3 } })
        const relatedData = await relatedResponse.json()
        setRelated(relatedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (scannerVisible) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasPermission(status === 'granted')
      })()
    }
  }, [scannerVisible])

  const handleBarcodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true)
    try {
      const payload = JSON.parse(data)
      if (payload.courseId) {
        await api('/courses/:id/attendance', 'POST', { params: { id: payload.courseId } })
        Alert.alert('Asistencia registrada', 'Tu asistencia fue registrada correctamente.')
        setScannerVisible(false)
      } else {
        Alert.alert('QR inválido', 'El código escaneado no es válido.')
      }
    } catch (e) {
      Alert.alert('QR inválido', 'El código escaneado no es válido.')
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para inscribirte en el curso')
      return
    }

    // Navigate to enrollment screen instead of direct enrollment
    router.push(`/curso/${cursoId}/inscripcion`)
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

  const handleUnsubscribe = async () => {
    Alert.alert('Darse de Baja', '¿Estás seguro de que quieres darte de baja de este curso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          try {
            const courseId = Array.isArray(cursoId) ? cursoId[0] : cursoId
            await api('/courses/:id/register', 'DELETE', { params: { id: courseId } })
            Alert.alert('Éxito', 'Te has dado de baja del curso')
            router.dismissTo('/')
          } catch (error) {
            console.error(error)
            Alert.alert('Error', 'No se pudo dar de baja del curso')
          }
        }
      }
    ])
  }

  // Darse de Baja button style
  const UnsubscribeButton = () => (
    <TouchableOpacity
      onPress={handleUnsubscribe}
      style={{
        alignSelf: 'flex-start',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 0,
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 8
      }}
    >
      <Ionicons name="log-out-outline" size={20} color="#fff" />
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Darse de Baja</Text>
    </TouchableOpacity>
  )

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

        {/* Owner Actions */}
        {isCreator && (
          <View style={styles.ownerActions}>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                { borderColor: '#4A90E2', backgroundColor: 'rgba(74,144,226,0.1)' }
              ]}
              onPress={() => setQrModalVisible(true)}
            >
              <Ionicons name="qr-code-outline" size={20} color="#4A90E2" />
              <Text style={[styles.deleteButtonText, { color: '#4A90E2' }]}>
                Generar QR de Asistencia
              </Text>
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

        {/* Description */}
        <Text style={styles.description}>{course.descripcion}</Text>

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
              <Text style={styles.moduleTitle}>{capitalize(modulo.titulo)}</Text>
            </View>
          ))}
        </View>

        {/* Darse de Baja button below Hero */}
        {isSubscribed && <UnsubscribeButton />}

        {/* QR Scanner for attendance */}
        {isSubscribed && (
          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
              marginHorizontal: 16,
              marginTop: 8,
              backgroundColor: '#4A90E2',
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 14,
              gap: 8
            }}
            onPress={() => setScannerVisible(true)}
          >
            <Ionicons name="qr-code-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              Escanear QR de Asistencia
            </Text>
          </TouchableOpacity>
        )}

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
      {!isCreator && !isSubscribed && user?.rol !== 'profesor' && (
        <ActionButton onPress={handleEnroll}>
          <Text style={styles.enrollBtnText}>Inscribirse</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </ActionButton>
      )}
      {/* If subscribed, show button to go to contenido */}
      {isSubscribed && (
        <View style={{ marginTop: 12 }}>
          <ActionButton onPress={() => router.push(`/curso/${cursoId}/contenido`)}>
            <Text style={styles.enrollBtnText}>Ir al Contenido</Text>
            <Ionicons name="book" size={24} color="#FFFFFF" />
          </ActionButton>
        </View>
      )}

      {/* QR Modal for owner */}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              QR de Asistencia
            </Text>
            <QRCode value={qrValue} size={220} />
            <Pressable
              onPress={() => setQrModalVisible(false)}
              style={{ marginTop: 24, padding: 12 }}
            >
              <Text style={{ color: '#4A90E2', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* QR Scanner Modal for students */}
      <Modal
        visible={scannerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {hasPermission === null ? (
            <Text style={{ color: '#fff' }}>Solicitando permiso de cámara...</Text>
          ) : hasPermission === false ? (
            <Text style={{ color: '#fff' }}>No se otorgó permiso para la cámara</Text>
          ) : (
            <View style={{ width: 300, height: 300 }}>
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417'] }}
                style={StyleSheet.absoluteFillObject}
              />
              {scanned && (
                <Button title={'Escanear de nuevo'} onPress={() => setScanned(false)} />
              )}
            </View>
          )}
          <Pressable
            onPress={() => {
              setScannerVisible(false)
              setScanned(false)
            }}
            style={{ marginTop: 24, padding: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  )
}

export default Page

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
    marginTop: 24,
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
