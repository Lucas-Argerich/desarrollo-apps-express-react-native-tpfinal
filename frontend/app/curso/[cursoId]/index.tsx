import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import CustomScreenView from '@/components/CustomScreenView'
import { api } from '@/services/api'
import { Curso } from '@/utils/types'
import CourseCard from '@/components/CourseCard'
import ActionButton from '@/components/ui/ActionButton'

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
      <CustomScreenView style={styles.bg}>
        <Text>Cargando...</Text>
      </CustomScreenView>
    )
  if (!course)
    return (
      <CustomScreenView style={styles.bg}>
        <Text>No se encontró el curso</Text>
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
      <CustomScreenView style={styles.bg}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        >
          {/* Top white bar */}
          <View style={styles.topBar} />
          {/* Imagen principal */}
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <Image
              source={{ uri: course.imagen ?? 'https://picsum.photos/id/374/462' }}
              style={styles.courseImage}
            />
          </View>
          {/* Tabs */}
          <View style={styles.tabsRow}>
            <Text style={styles.tabActive}>Resumen</Text>
            <Text style={styles.tabInactive}>Detalles</Text>
          </View>
          {/* Info row */}
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Image
                    source={{ uri: 'https://picsum.photos/id/20/20' }}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.infoText}>6 semanas</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Image
                    source={{ uri: 'https://picsum.photos/id/16/16' }}
                    style={{ width: 16, height: 16 }}
                  />
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={styles.infoText}>2 horas</Text>
                  <Text style={styles.infoSubText}>semanales</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoCol}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Image
                    source={{ uri: 'https://picsum.photos/id/18/18' }}
                    style={{ width: 18, height: 18 }}
                  />
                </View>
                <Text style={styles.infoText}>intermedio</Text>
              </View>
              <View style={styles.infoItem}>
                <Image
                  source={{ uri: 'https://picsum.photos/id/34/34' }}
                  style={{ width: 34, height: 34, borderRadius: 8 }}
                />
                <Text style={styles.infoText}>4.8</Text>
              </View>
            </View>
          </View>
          {/* Descripción */}
          <Text style={styles.description}>
            {course.descripcion ||
              'Aprende desde cero las técnicas esenciales de la panadería artesanal. Descubre cómo hacer panes crujientes, esponjosos y llenos de sabor utilizando ingredientes naturales y procesos tradicionales.'}
          </Text>
          {/* White bar */}
          <View style={styles.topBar} />
          {/* Contenido */}
          <View style={styles.tabsRow}>
            <Text style={styles.sectionTitle}>Contenido</Text>
          </View>
          <Text style={styles.contentDescription}>
            Clases en vivo por videoconferencia, interactúa con el instructor en tiempo real y
            accede a material digital.
          </Text>
          <View style={styles.modulesList}>
            {course.modulos?.map((modulo, index) => (
              <View key={index} style={styles.moduleItem}>
                <Text style={styles.moduleNumber}>{index + 1}.</Text>
                <Text style={styles.moduleTitle}>{modulo.titulo}</Text>
              </View>
            ))}
          </View>
          {/* White bar */}
          <View style={styles.topBar} />
          {/* Ingredientes Necesarios */}
          <Text style={styles.sectionTitle}>Ingredientes Necesarios</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 18 }}
          >
            {ingredientes.map((ing, idx) => (
              <View key={idx} style={styles.ingredientCard}>
                <Image
                  source={{ uri: 'https://picsum.photos/113/93' }}
                  style={styles.ingredientImg}
                />
                <View style={styles.ingredientTextBox}>
                  <Text style={styles.ingredientName}>{ing.nombre}</Text>
                  <Text style={styles.ingredientQty}>{ing.cantidad}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* White bar */}
          <View style={styles.topBar} />
          {/* Utensilios Recomendados */}
          <Text style={styles.sectionTitle}>Utensilios Recomendados</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 18 }}
          >
            {utensilios.map((ut, idx) => (
              <View key={idx} style={styles.utensilCard}>
                <Image
                  source={{ uri: 'https://picsum.photos/113/93' }}
                  style={styles.ingredientImg}
                />
                <View style={styles.ingredientTextBox}>
                  <Text style={styles.ingredientName}>{ut}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* White bar */}
          <View style={styles.topBar} />
          {/* Cursos Relacionados */}
          <View style={styles.relatedHeaderRow}>
            <Text style={styles.relatedTitle}>Cursos Relacionados</Text>
            <Text style={styles.relatedSeeMore}>Ver mas</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 32 }}
          >
            {related?.map((rel, idx) => (
              <CourseCard item={rel} key={idx} />
            ))}
          </ScrollView>
          {/* Inscribirse button */}
        </ScrollView>
      </CustomScreenView>
      <ActionButton onPress={() => router.push(`/curso/${cursoId}/inscripcion`)}>
        <Text style={styles.enrollBtnText}>Inscribirse</Text>
      </ActionButton>
    </>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 0
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
    marginBottom: 12,
    marginLeft: 4
  },
  tabActive: {
    color: '#1B1B1B',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600'
  },
  tabInactive: {
    color: 'rgba(27,27,27,0.62)',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600'
  },
  infoRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 12,
    marginLeft: 4
  },
  infoCol: {
    flex: 1,
    gap: 24
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  infoIcon: {
    width: 34,
    height: 34,
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6
  },
  infoText: {
    color: '#7E7E7E',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  infoSubText: {
    color: '#A5A5A5',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginTop: -2
  },
  description: {
    color: '#A5A5A5',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 18,
    marginLeft: 4
  },
  sectionTitle: {
    color: '#1B1B1B',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4
  },
  contentDescription: {
    color: '#A5A5A5',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 18,
    marginLeft: 4
  },
  modulesList: {
    gap: 12,
    marginBottom: 18
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    marginBottom: 6
  },
  moduleNumber: {
    color: '#A5A5A5',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginRight: 8
  },
  moduleTitle: {
    flex: 1,
    color: '#A5A5A5',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500'
  },
  ingredientCard: {
    width: 113,
    height: 177,
    backgroundColor: 'rgba(238,150,75,0.6)',
    borderRadius: 20,
    marginRight: 12,
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
    fontWeight: '700',
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
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden'
  },
  relatedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 4,
    marginRight: 4
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
    fontSize: 16
  },
  enrollBtn: {
    width: 373,
    height: 66,
    backgroundColor: '#EE964B',
    borderRadius: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 13 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 4,
    position: 'absolute',
    bottom: 20
  },
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center'
  }
})
