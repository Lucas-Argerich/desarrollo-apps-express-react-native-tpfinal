import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import { api } from '@/services/api'
import { Curso } from '@/utils/types'
import CourseCard from '@/components/CourseCard'
import ActionButton from '@/components/ui/ActionButton'
import { Ionicons } from '@expo/vector-icons'
import Hero from '@/components/ui/Hero'
import { capitalize } from '@/utils'

export default function CursoScreen() {
  const { cursoId } = useLocalSearchParams()
  const [course, setCourse] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Curso[] | null>(null)

  useEffect(() => {
    if (cursoId && typeof cursoId === 'string') {
      api('/courses/:id', 'GET', { params: { id: cursoId } })
        .then(async (res) => {
          const data = await res.json()
          setCourse(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    api('/courses', 'GET', {
      query: {
        limit: 2
      }
    })
      .then((res) => res.json())
      .then((data) => setRelated(data))
  }, [cursoId])

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

  // Placeholder data for ingredients and utensils
  const ingredientes = [
    { nombre: 'Harina de Trigo', cantidad: '500g' },
    { nombre: 'Levadura Seca', cantidad: '5g' },
    { nombre: 'Sal', cantidad: '10g' },
    { nombre: 'Azucar', cantidad: '10g' },
    { nombre: 'Aceite de Oliva', cantidad: '30ml (Opcional)' }
  ]
  const utensilios = [
    'Bol Grande',
    'Balanza de Cocina',
    'Rodillo de Amasar',
    'Rasqueta',
    'Horno con Termómetro',
    'Bandeja de Hornear'
  ]

  return (
    <>
      <CustomScreenView>
        <Hero image={course.imagen ?? 'https://picsum.photos/id/374/462'}>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>{capitalize(course.titulo ?? '')}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {course.calificacion?.toFixed(1) ?? '4.8'}
              </Text>
              <Ionicons name="star" size={16} color="#fff" />
            </View>
          </View>
        </Hero>

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

        {/* Descripción */}
        <Text style={styles.description}>
          {course.descripcion ||
            'Aprende desde cero las técnicas esenciales de la panadería artesanal. Descubre cómo hacer panes crujientes, esponjosos y llenos de sabor utilizando ingredientes naturales y procesos tradicionales.'}
        </Text>
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
              <Text style={styles.moduleTitle}>{modulo.titulo}</Text>
            </View>
          ))}
        </View>
        {/* Ingredientes Necesarios */}
        <Text style={styles.sectionTitle}>Ingredientes Necesarios</Text>
        <FlatList
          data={ingredientes}
          keyExtractor={(item, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 18, gap: 16 }}
          renderItem={({ item }) => (
            <View style={styles.ingredientCard}>
              <Image
                source={{ uri: 'https://picsum.photos/113/93' }}
                style={styles.ingredientImg}
              />
              <View style={styles.ingredientTextBox}>
                <Text style={styles.ingredientName}>{item.nombre}</Text>
                <Text style={styles.ingredientQty}>{item.cantidad}</Text>
              </View>
            </View>
          )}
          style={{ marginLeft: 16 }}
        />
        {/* Utensilios Recomendados */}
        <Text style={styles.sectionTitle}>Utensilios Recomendados</Text>
        <FlatList
          data={utensilios}
          keyExtractor={(item, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 18, gap: 16 }}
          renderItem={({ item }) => (
            <View style={styles.utensilCard}>
              <Image
                source={{ uri: 'https://picsum.photos/113/93' }}
                style={styles.ingredientImg}
              />
              <View style={styles.ingredientTextBox}>
                <Text style={styles.ingredientName}>{item}</Text>
              </View>
            </View>
          )}
          style={{ marginLeft: 16 }}
        />
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
      <ActionButton onPress={() => router.push(`/curso/${cursoId}/inscripcion`)}>
        <Text style={styles.enrollBtnText}>Inscribirse</Text>
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </ActionButton>
    </>
  )
}

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
  ingredientCard: {
    width: 113,
    height: 177,
    backgroundColor: 'rgba(238,150,75,0.6)',
    borderRadius: 16,
    overflow: 'hidden'
  },
  ingredientImg: {
    width: 113,
    height: 93,
    resizeMode: 'cover'
  },
  ingredientTextBox: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-start'
  },
  ingredientName: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2
  },
  ingredientQty: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14
  },
  utensilCard: {
    width: 113,
    height: 177,
    backgroundColor: 'rgba(13,59,102,0.4)',
    borderRadius: 16,
    overflow: 'hidden'
  },
  relatedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 16,
    marginHorizontal: 16,
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
