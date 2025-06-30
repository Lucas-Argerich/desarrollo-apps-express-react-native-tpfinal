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

export default function PerfilScreen() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [coursesLength, setCoursesLength] = useState<number>(0)
  const [recipesLength, setRecipesLength] = useState<number>(0)
  const [statsLoading, setStatsLoading] = useState(false)

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

        <Button onPress={() => {}} style={styles.editButton} textStyle={styles.editButtonText}>
          Editar perfil
          <MaterialIcons name="edit" size={24} color="#FFF" />
        </Button>
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
    justifyContent: 'center'
  },
  editButtonText: {
    fontSize: 16,
    color: '#FFF'
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
