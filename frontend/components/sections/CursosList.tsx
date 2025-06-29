import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native'
import CourseCard from '../CourseCard'
import { Curso } from '@/utils/types'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

// Mock data for demonstration
export default function CursosList() {
  const [courses, setCourses] = useState<Curso[]>([])

  useEffect(() => {
    api('/courses', 'GET', {})
      .then(async (res) => {
        const data = await res.json()
        setCourses(data)
      })
      .catch((err) => {
        setCourses([]) // fallback to empty
      })
  }, [])

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cursos Destacados</Text>
        <TouchableOpacity>
          <Text style={styles.seeMore}>Ver mas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.idCurso.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <CourseCard item={item} />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  seeMore: {
    color: '#007AFF',
    fontSize: 16
  },
  courseCard: {
    width: 220,
    height: 120,
    backgroundColor: '#222',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  courseImage: {
    width: 100,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16
  },
  courseInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'center'
  },
  courseTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2
  },
  courseLevel: {
    color: '#CAC8C8',
    fontSize: 13,
    marginBottom: 8
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  courseMetaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 13
  }
})
