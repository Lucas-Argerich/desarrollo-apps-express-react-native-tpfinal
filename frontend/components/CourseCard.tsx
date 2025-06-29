import { Curso } from '@/utils/types'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'

interface CourseCardProps {
  item: Curso
}

export default function CourseCard({ item: course }: CourseCardProps) {
  return (
    <Link href={`/curso/${course.idCurso}`} asChild>
      <Pressable>
        <View style={styles.courseCard}>
          <Image source={{ uri: course.imagen ?? '' }} style={styles.courseImage} />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.titulo}</Text>
            <Text style={styles.courseLevel}>{course.dificultad}</Text>
            <View style={styles.courseMeta}>
              <Ionicons name="people-outline" size={14} color="#fff" />
              <Text style={styles.courseMetaText}>{/*course.students*/23}</Text>
              <Ionicons name="star" size={14} color="#FFD700" style={{ marginLeft: 8 }} />
              <Text style={styles.courseMetaText}>{/*course.rating*/4.2}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
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
