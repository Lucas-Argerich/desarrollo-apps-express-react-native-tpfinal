import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import Header from '../../components/ui/Header'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import CustomScreenView from '../../components/CustomScreenView'
import { authService } from '../../services/auth'
import { router } from 'expo-router'
import { getUserCourses, getUserFavoriteRecipes, getUserCreatedRecipes, getUserCreatedCourses } from '../../services/api'
import * as ImagePicker from 'expo-image-picker'
import Input from '../../components/ui/Input'

export default function PerfilScreen() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [coursesLength, setCoursesLength] = useState<number>(0)
  const [recipesLength, setRecipesLength] = useState<number>(0)
  const [statsLoading, setStatsLoading] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [studentForm, setStudentForm] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    tramiteNumber: '',
    dniFront: undefined,
    dniBack: undefined,
  })
  const [studentLoading, setStudentLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getUser()
        setUser(user)
      } catch (error) {
        console.log(error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user) return
    setStatsLoading(true)
    const promises = []
    if (user.rol === 'profesor') { 
      promises.push(getUserCreatedCourses(), getUserCreatedRecipes())
    } else {
      promises.push(getUserCourses(), getUserFavoriteRecipes())
    }
    Promise.all(promises)
      .then((results) => {
        setCoursesLength(results[0].length)
        setRecipesLength(results[1].length)
      })
      .catch((err) => {
        console.log(err)
        setCoursesLength(0)
        setRecipesLength(0)
      })
      .finally(() => setStatsLoading(false))
  }, [user])

  const isProfesor = user?.rol === 'profesor'

  const handleStudentInputChange = (field: string, value: any) => {
    setStudentForm(prev => ({ ...prev, [field]: value }))
  }

  const pickImage = async (type: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      handleStudentInputChange(type === 'front' ? 'dniFront' : 'dniBack', result.assets[0])
    }
  }

  const handleConvertToStudent = async () => {
    // Validate fields
    if (!studentForm.cardNumber || !studentForm.cardExpiry || !studentForm.cardCVV || !studentForm.tramiteNumber || !studentForm.dniFront || !studentForm.dniBack) {
      alert('Por favor completa todos los campos y sube ambas imágenes del DNI.')
      return
    }
    setStudentLoading(true)
    try {
      await authService.convertToStudent({
        numeroTarjeta: studentForm.cardNumber,
        vencimientoTarjeta: studentForm.cardExpiry,
        CVVTarjeta: studentForm.cardCVV,
        numeroTramite: studentForm.tramiteNumber,
        dniFront: studentForm.dniFront,
        dniBack: studentForm.dniBack,
      })
      alert('¡Ahora eres estudiante!')
      // Refresh user info
      const updatedUser = await authService.getUser()
      setUser(updatedUser)
      setShowStudentForm(false)
    } catch (err) {
      alert('Error al convertir a estudiante: ' + (err))
    } finally {
      setStudentLoading(false)
    }
  }

  if (loading || statsLoading) {
    return (
      <CustomScreenView style={styles.container}>
        <Header title="Perfil" subtitle="" />
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </View>
      </CustomScreenView>
    )
  }

  if (!user) {
    return (
      <CustomScreenView style={styles.container}>
        <Header title="Perfil" subtitle="Inicia sesión para ver tu perfil" />
        <View style={styles.unauthorizedContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#888" />
          <Text style={styles.unauthorizedTitle}>No has iniciado sesión</Text>
          <Text style={styles.unauthorizedText}>
            Inicia sesión para acceder a tu perfil y ver tu progreso
          </Text>
          <Button onPress={() => router.push('/auth/login')} style={styles.loginButton}>
            Iniciar sesión
          </Button>
          <Button
            onPress={() => router.push('/auth/register')}
            style={styles.registerButton}
            textStyle={styles.registerButtonText}
          >
            Crear cuenta
          </Button>
        </View>
      </CustomScreenView>
    )
  }

  return (
    <CustomScreenView style={styles.container}>
      <Header title="Perfil" subtitle={isProfesor ? 'Perfil de Profesor' : 'Perfil de Alumno'} />

      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.avatar || 'https://picsum.photos/200/200' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.nombre || user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>

        { user.rol !== 'alumno' && !showStudentForm && (
          <Button onPress={() => setShowStudentForm(true)} style={styles.editButton} textStyle={styles.editButtonText}>
            Convertir a Estudiante
          </Button>
        )}
        {showStudentForm && (
          <View style={{ width: '100%', marginTop: 16, gap: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Datos para ser Estudiante</Text>
            <Input
              label="Número de Tarjeta"
              placeholder="XXXX XXXX XXXX XXXX"
              value={studentForm.cardNumber}
              onChangeText={v => handleStudentInputChange('cardNumber', v)}
              keyboardType="number-pad"
              maxLength={16}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Input
                label="Vencimiento"
                placeholder="MM/AA"
                value={studentForm.cardExpiry}
                onChangeText={v => handleStudentInputChange('cardExpiry', v)}
                maxLength={5}
              />
              <Input
                label="CVV"
                placeholder="XXX"
                value={studentForm.cardCVV}
                onChangeText={v => handleStudentInputChange('cardCVV', v)}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
              />
            </View>
            <Input
              label="Número de Trámite"
              placeholder="Número de trámite del DNI"
              value={studentForm.tramiteNumber}
              onChangeText={v => handleStudentInputChange('tramiteNumber', v)}
              keyboardType="number-pad"
            />
            <View style={{ flexDirection: 'row', gap: 12, marginVertical: 16 }}>
              <Button onPress={() => pickImage('front')} style={{ flex: 1, backgroundColor: '#EE964B' }}>
                {studentForm.dniFront ? 'DNI Frente ✓' : 'Subir DNI Frente'}
              </Button>
              <Button onPress={() => pickImage('back')} style={{ flex: 1, backgroundColor: '#EE964B' }}>
                {studentForm.dniBack ? 'DNI Dorso ✓' : 'Subir DNI Dorso'}
              </Button>
            </View>
            <Button onPress={handleConvertToStudent} loading={studentLoading}>
              Confirmar y Convertirme en Estudiante
            </Button>
            <Button onPress={() => setShowStudentForm(false)} style={{ marginTop: 8, backgroundColor: '#eee' }} textStyle={{ color: '#333' }}>
              Cancelar
            </Button>
          </View>
        )}
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{coursesLength}</Text>
          <Text style={styles.statLabel}>{isProfesor ? 'Cursos creados' : 'Cursos'}</Text>
        </View>
        
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{recipesLength}</Text>
          <Text style={styles.statLabel}>{isProfesor ? 'Recetas creadas' : 'Recetas'}</Text>
        </View>
      </View>

      {!isProfesor && (
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progreso general</Text>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Cursos completados</Text>
              <Text style={styles.progressValue}>0/{coursesLength}</Text>
            </View>
            <ProgressBar progress={0} style={styles.progressBar} />
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Recetas guardadas</Text>
              <Text style={styles.progressValue}>
                {recipesLength}/{recipesLength}
              </Text>
            </View>
            <ProgressBar progress={recipesLength ? 1 : 0} style={styles.progressBar} />
          </View>
        </View>
      )}

      <Button
        onPress={() => {
          authService.logout()
          setUser(null)
        }}
        style={styles.logoutButton}
      >
        Cerrar sesión
      </Button>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 48
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginTop: 16,
    marginBottom: 8
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24
  },
  loginButton: {
    width: '100%',
    marginBottom: 12
  },
  registerButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2F2F2F'
  },
  registerButtonText: {
    color: '#2F2F2F'
  },
  content: {
    flex: 1
  },
  editButton: {
    paddingHorizontal: 10,
    gap: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  editButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#888'
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F5F5F5'
  },
  progressSection: {
    padding: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 16
  },
  progressItem: {
    marginBottom: 16
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  progressTitle: {
    fontSize: 16,
    color: '#2F2F2F'
  },
  progressValue: {
    fontSize: 14,
    color: '#888'
  },
  progressBar: {
    marginBottom: 8
  },
  menuSection: {
    padding: 24
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2F2F2F',
    marginLeft: 16
  },
  logoutButton: {
    margin: 24
  }
})
