import { useCallback, useState } from 'react'
import { Text, StyleSheet, FlatList, View, Dimensions } from 'react-native'
import CustomScreenView from '../../components/CustomScreenView'
import Header from '@/components/ui/Header'
import SearchResult from '@/components/SearchResult'
import { api } from '@/services/api'
import { Curso, Receta } from '@/utils/types'
import SectionHeader from '@/components/ui/SectionHeader'
import { useFocusEffect, router } from 'expo-router'
import CourseCard from '@/components/CourseCard'
import { Ionicons } from '@expo/vector-icons'
import { authService } from '@/services/auth'
import Button from '@/components/ui/Button'

const SCREEN_WIDTH = Dimensions.get('window').width

function CourseSkeleton() {
  return (
    <View style={styles.skeletonCourseCard}>
      <View style={styles.skeletonCourseImage} />
      <View style={styles.skeletonCourseInfo}>
        <View style={styles.skeletonCourseTitle} />
        <View style={styles.skeletonCourseMetaRow}>
          <View style={styles.skeletonCourseMeta} />
          <View style={styles.skeletonCourseMeta} />
        </View>
      </View>
    </View>
  )
}

function RecipeSkeleton() {
  return (
    <View style={[styles.skeletonRecipeCard, { width: SCREEN_WIDTH / 2 - 34 }]}>
      <View style={styles.skeletonRecipeImage} />
      <View style={styles.skeletonRecipeInfo}>
        <View style={styles.skeletonRecipeTitle} />
        <View style={styles.skeletonRecipeMetaRow}>
          <View style={styles.skeletonRecipeMeta} />
          <View style={styles.skeletonRecipeMeta} />
        </View>
      </View>
    </View>
  )
}

function EmptyState({ icon, message }: { icon: any; message: string }) {
  return (
    <View style={[styles.emptyStateContainer, { width: SCREEN_WIDTH - 32 }]}>
      <Ionicons name={icon} size={48} color="#E0E0E0" style={{ marginBottom: 12 }} />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  )
}

export default function RecetarioScreen() {
  const [myCourses, setMyCourses] = useState<Curso[]>([])
  const [favorite, setFavorite] = useState<Receta[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      setFavorite([])
      setMyCourses([])

      authService
        .getUser()
        .then((u) => {
          setUser(u)
          return u
        })
        .then((u) => {
          if (u?.rol === 'profesor') {
            // Fetch created courses
            return Promise.all([
              api('/courses/user/created', 'GET')
                .then((res) => res.json())
                .then((data) => {
                  setMyCourses(data)
                }),
              // Fetch created recipes (by user)
              api('/recipes/user/created', 'GET')
                .then((res) => res.json())
                .then((data) => {
                  setFavorite(data)
                })
            ])
          } else {
            // Alumno: fetch favorites and subscribed courses

            return Promise.all([
              api('/recipes/user/favorites', 'GET', {
                query: { limit: 4 }
              })
                .then((res) => res.json())
                .then((data) => {
                  setFavorite(data)
                }),
              api('/courses/user/subscribed', 'GET')
                .then((res) => res.json())
                .then((data) => {
                  setMyCourses(data)
                })
            ])
          }
        })
        .finally(() => {
          setLoading(false)
        })
      return () => {
        setLoading(false)
      }
    }, [])
  )

  return (
    <CustomScreenView>
      {/* Header */}
      <Header
        title="Mi Recetario"
        subtitle={
          user?.rol === 'profesor'
            ? 'Tus cursos y recetas creados en un solo lugar'
            : 'Tus cursos y recetas favoritas en un solo lugar'
        }
      />

      <SectionHeader
        title={user?.rol === 'profesor' ? 'Cursos creados' : 'Mis Cursos'}
        style={{ marginHorizontal: 24, marginTop: 16, marginBottom: 16 }}
      />
      {user?.rol === 'profesor' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginHorizontal: 24,
            marginBottom: 8
          }}
        >
          <Button onPress={() => router.push('/curso/nuevo')}>Nuevo Curso</Button>
        </View>
      )}
      <FlatList
        data={myCourses}
        keyExtractor={(item) => item.idCurso.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
        renderItem={({ item }) => <CourseCard item={item} />}
        ListEmptyComponent={
          loading ? (
            <View style={{ flexDirection: 'row' }}>
              {[1, 2].map((_, idx) => (
                <CourseSkeleton key={idx} />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="school-outline"
              message={
                user?.rol === 'profesor'
                  ? 'No has creado ningún curso.'
                  : 'No estas suscrito a ningún curso.'
              }
            />
          )
        }
        style={{ minHeight: 211 }}
      />

      <SectionHeader
        title={user?.rol === 'profesor' ? 'Recetas creadas' : 'Mis Recetas'}
        style={{ marginHorizontal: 24, marginTop: 16, marginBottom: 16 }}
      />
      {user?.rol === 'profesor' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginHorizontal: 24,
            marginBottom: 8
          }}
        >
          <Button onPress={() => router.push('/receta/nueva')}>Nueva Receta</Button>
        </View>
      )}
      <FlatList
        scrollEnabled={false}
        data={favorite}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        renderItem={({ item }) => <SearchResult result={{ type: 'recipe', data: item }} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: 4
              }}
            >
              {[1, 2, 3, 4].map((_, idx) => (
                <RecipeSkeleton key={idx} />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="heart-outline"
              message={
                user?.rol === 'profesor'
                  ? 'No has creado ninguna receta.'
                  : 'No tienes recetas favoritas.'
              }
            />
          )
        }
        style={{ marginHorizontal: 16, minHeight: 320 }}
      />
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  loadingText: {
    color: '#888',
    fontSize: 16,
    padding: 16,
    textAlign: 'center'
  },
  skeletonCourseCard: {
    width: 280,
    height: 211,
    borderRadius: 24,
    backgroundColor: '#ececec',
    marginRight: 16,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  skeletonCourseImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0'
  },
  skeletonCourseInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end'
  },
  skeletonCourseTitle: {
    width: '80%',
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 12
  },
  skeletonCourseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skeletonCourseMeta: {
    width: 40,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 6
  },
  skeletonRecipeCard: {
    width: 150,
    height: 220,
    borderRadius: 16,
    backgroundColor: '#ececec',
    marginRight: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  skeletonRecipeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0'
  },
  skeletonRecipeInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end'
  },
  skeletonRecipeTitle: {
    width: '80%',
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 10
  },
  skeletonRecipeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skeletonRecipeMeta: {
    width: 30,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 120
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4
  }
})
