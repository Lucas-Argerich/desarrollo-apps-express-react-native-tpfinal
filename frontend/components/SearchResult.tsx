import { Curso, Receta } from '@/utils/types'
import React from 'react'
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

type MixedResult = { type: 'course'; data: Curso } | { type: 'recipe'; data: Receta }

// SearchResult component
export default function SearchResult({ result }: { result: MixedResult }) {
  const { type, data } = result

  const isCourse = type === 'course'
  const screenWidth = Dimensions.get('window').width
  const cardWidth = screenWidth / 2 - 32 // 8px margin on each side
  const cardHeight = 240
  const imageUrl = isCourse ? data.imagen : data.fotoPrincipal

  // Helper to extract rating from calificaciones
  function getRecipeRating(calificaciones: any[]): number {
    if (!calificaciones || calificaciones.length === 0) return 4.8
    const c = calificaciones[0]
    if (typeof c.puntaje === 'number') return c.puntaje
    if (typeof c.valor === 'number') return c.valor
    // fallback: first numeric property
    for (const key in c) {
      if (typeof c[key] === 'number') return c[key]
    }
    return 4.8
  }
  const rating = isCourse
    ? data.calificacion || 4.8
    : getRecipeRating(data.calificaciones)
  const modality = isCourse ? data.modalidad || 'Virtual' : undefined
  const duration = isCourse ? data.duracion || 2 : undefined
  const title = isCourse ? data.titulo : data.nombreReceta

  return (
    <Link href={isCourse ? `/curso/${data.idCurso}` : `/receta/${data.idReceta}`} asChild>
      <Pressable>
        <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
          <Image source={{ uri: imageUrl ?? '' }} style={StyleSheet.absoluteFill} />
          <View style={styles.overlay}>
            {isCourse ? (
              <>
                {/* Top info box */}
                <View style={styles.infoBoxCourse}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.courseLabelRow}>
                      <Text style={styles.typeLabel}>Curso</Text>
                      <View style={styles.ratingRow}>
                        <Text style={styles.ratingText}>{rating}</Text>
                        <Ionicons
                          name="star"
                          size={14}
                          color="#CAC8C8"
                          style={{ marginLeft: 2, marginBottom: 1 }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                {/* Bottom info box */}
                <View style={styles.infoBoxCourseBottom}>
                  <View style={styles.courseMetaRow}>
                    <View style={styles.courseMetaLeft}>
                      <Ionicons
                        name="laptop-outline"
                        size={13}
                        color="#fff"
                        style={{ marginRight: 2 }}
                      />
                    </View>
                    <View style={styles.courseModBox}>
                      <Text style={styles.modalityText}>{modality}</Text>
                      <Text style={styles.durationText}>
                        <Text style={styles.durationNum}>{duration}</Text>
                        <Text style={styles.durationUnit}>h</Text> semanales
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.infoBoxRecipe}>
                <View style={styles.recipeTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.typeLabel}>Receta</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>{rating}</Text>
                    <Ionicons
                      name="star"
                      size={14}
                      color="#CAC8C8"
                      style={{ marginLeft: 2, marginBottom: 1 }}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  infoBoxRecipe: {
    height: 75,
    backgroundColor: 'rgba(29,29,29,0.4)',
    borderRadius: 10,
    padding: 11,
    margin: 8,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  recipeTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  infoBoxCourse: {
    height: 75,
    backgroundColor: 'rgba(29,29,29,0.4)',
    borderRadius: 10,
    padding: 11,
    margin: 8,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  infoBoxCourseBottom: {
    backgroundColor: 'rgba(29,29,29,0.4)',
    borderRadius: 10,
    padding: 11,
    margin: 8,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  courseLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  courseMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 2
  },
  typeLabel: {
    color: '#CAC8C8',
    fontSize: 13,
    fontFamily: 'Roboto',
    fontWeight: '600'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 4
  },
  ratingText: {
    color: '#CAC8C8',
    fontSize: 13,
    fontFamily: 'Roboto',
    fontWeight: '600'
  },
  courseModBox: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  modalityText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginLeft: 2
  },
  durationText: {
    color: '#CAC8C8',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 13
  },
  durationNum: {
    fontSize: 12
  },
  durationUnit: {
    fontSize: 10
  }
})
