import { Curso } from '@/utils/types'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { BlurView } from 'expo-blur'
import { capitalize } from '@/utils'

interface CourseCardProps {
  item: Curso
}

export default function CourseCard({ item: course }: CourseCardProps) {
  return (
    <Link href={`/curso/${course.idCurso}`} asChild>
      <Pressable>
        <View style={styles.card}>
          <Image source={{ uri: course.imagen ?? '' }} style={styles.img} />
          <View style={styles.cardOverlay}>
            <BlurView style={styles.cardtextBox} intensity={20}>
              <Text style={styles.cardTitle}>{capitalize(course.titulo ?? '')}</Text>
              <Text style={styles.cardLevel}>{course.dificultad}</Text>
              <View style={styles.cardStatsRow}>
                <View style={styles.cardStat}>
                  <Text style={styles.cardStatText}>{course.alumnos}</Text>
                  <Ionicons name="people-outline" size={14} color="#fff" />
                </View>
                <View style={styles.cardStat}>
                  <Text style={styles.cardStatText}>{course.calificacion}</Text>
                  <Ionicons name="star" size={14} color="#fff" style={{ marginBottom: 2 }} />
                </View>
              </View>
            </BlurView>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 317,
    height: 211,
    borderRadius: 30,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1D1D1D',
  },
  img: {
    width: 317,
    height: 211,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 30,
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    height: 211,
    padding: 15,
    borderRadius: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardtextBox: {
    width: 224,
    height: 75,
    backgroundColor: 'rgba(29,29,29,0.6)',
    borderRadius: 15,
    overflow: 'hidden',
    padding: 11,
    gap: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 2,
  },
  cardLevel: {
    color: '#CAC8C8',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 22,
  },
  cardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cardStatText: {
    color: '#CAC8C8',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
})
