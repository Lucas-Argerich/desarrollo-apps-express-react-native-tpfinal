import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Header from '../../components/ui/Header'
import SectionHeader from '../../components/ui/SectionHeader'
import ProgressBar from '../../components/ui/ProgressBar'
import CustomScreenView from '../../components/CustomScreenView'
import { api } from '@/services/api'
import RecipeCard from '@/components/RecipeCard'
import CourseCard from '../../components/CourseCard'

export default function RecientesScreen() {
  // State for dynamic data
  const [recentCourse, setRecentCourse] = useState<any>(null)
  const [recentRecipes, setRecentRecipes] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const recipesPromise = api('/recipes', 'GET', { query: { offset: 2, limit: 2 } })
      .then((res) => res.json())
      .then((data) => {
        setRecentCourse(null)
        setRecentSearches([])
        setRecentRecipes(data || [])
      })
      .catch((err) => {
        setError('No se pudieron cargar los recientes.')
      })
    const coursesPromise = api('/courses/user/subscribed', 'GET')
      .then((res) => res.json())
      .then((data) => {
        setEnrolledCourses(data || [])
      })
      .catch(() => setEnrolledCourses([]))
    Promise.all([recipesPromise, coursesPromise])
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <CustomScreenView style={styles.container}>
        <Header title="Recientes" subtitle="Tus últimas actividades" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando...</Text>
        </View>
      </CustomScreenView>
    )
  }

  if (error) {
    return (
      <CustomScreenView style={styles.container}>
        <Header title="Recientes" subtitle="Tus últimas actividades" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      </CustomScreenView>
    )
  }

  return (
    <CustomScreenView style={styles.container}>
      <Header title="Recientes" subtitle="Tus últimas actividades" />

      <ScrollView style={styles.content}>
        <SectionHeader title="Continuar curso" showSeeMore={false} />
        {recentCourse ? (
          <TouchableOpacity
            style={styles.continueCourse}
            activeOpacity={0.85}
            onPress={() => router.push(`/curso/${recentCourse.id}`)}
          >
            <Image source={{ uri: recentCourse.image }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
              <View style={styles.courseHeader}>
                <View style={styles.courseType}>
                  <Text style={styles.courseTypeText}>Curso</Text>
                </View>
                <Text style={styles.courseTitle}>{recentCourse.title}</Text>
              </View>
              <Text style={styles.courseSubtitle}>{recentCourse.module}</Text>
              <ProgressBar progress={recentCourse.progress} style={styles.progressBar} />
              <Text style={styles.progressText}>
                {Math.round(recentCourse.progress * 100)}% completado
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyText}>No hay cursos recientes.</Text>
        )}

        <SectionHeader title="Recetas recientes" onSeeMorePress={() => router.replace('/recetario')} />
        {recentRecipes.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recipesContainer}
          >
            {recentRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No hay recetas recientes.</Text>
        )}

        {/* Enrolled Courses Section */}
        <SectionHeader title="Cursos inscriptos" onSeeMorePress={() => router.replace('/recetario')} />
        {enrolledCourses.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recipesContainer}
          >
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.idCurso || course.id}
                item={course}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No hay cursos inscriptos.</Text>
        )}

        <SectionHeader title="Búsquedas recientes" onSeeMorePress={() => router.replace('/busqueda')} />
        <View style={styles.searchesContainer}>
          {recentSearches.length > 0 ? (
            recentSearches.map((search, idx) => (
              <TouchableOpacity key={idx} style={styles.searchItem} activeOpacity={0.7}>
                <Ionicons name="time-outline" size={20} color="#888" />
                <Text style={styles.searchText}>{search}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay búsquedas recientes.</Text>
          )}
        </View>
      </ScrollView>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1
  },
  continueCourse: {
    margin: 16,
    backgroundColor: '#222',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6
  },
  courseImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  courseInfo: {
    padding: 16
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  courseType: {
    backgroundColor: '#EE964B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8
  },
  courseTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  courseTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  courseSubtitle: {
    color: '#CAC8C8',
    fontSize: 14,
    marginBottom: 12
  },
  progressBar: {
    marginBottom: 8
  },
  progressText: {
    color: '#CAC8C8',
    fontSize: 12
  },
  recipesContainer: {
    paddingLeft: 16,
    marginTop: 8,
    marginBottom: 8
  },
  recipeCard: {
    marginRight: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  searchesContainer: {
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2F2F2F'
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 12
  }
})
