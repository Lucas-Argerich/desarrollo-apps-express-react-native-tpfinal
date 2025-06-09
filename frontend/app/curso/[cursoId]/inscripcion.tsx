import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomScreenView from '@/components/CustomScreenView';

type CourseType = 'virtual' | 'online' | 'presencial';

const ingredients = [
  { id: 1, name: 'Harina de Trigo', amount: '500g', image: 'https://picsum.photos/113/93' },
  { id: 2, name: 'Levadura Seca', amount: '5g', image: 'https://picsum.photos/113/93' },
  { id: 3, name: 'Sal', amount: '10g', image: 'https://picsum.photos/113/93' },
  { id: 4, name: 'Azucar', amount: '10g', image: 'https://picsum.photos/113/93' },
  { id: 5, name: 'Aceite de Oliva', amount: '30ml (Opcional)', image: 'https://picsum.photos/113/93' },
];

const utensils = [
  { id: 1, name: 'Bol Grande', image: 'https://picsum.photos/113/93' },
  { id: 2, name: 'Balanza de Cocina', image: 'https://picsum.photos/113/93' },
  { id: 3, name: 'Rodillo de Amasar', image: 'https://picsum.photos/113/93' },
  { id: 4, name: 'Rasqueta', image: 'https://picsum.photos/113/93' },
  { id: 5, name: 'Horno con Termómetro', image: 'https://picsum.photos/113/93' },
  { id: 6, name: 'Bandeja de Hornear', image: 'https://picsum.photos/113/93' },
];

const relatedCourses = [
  {
    id: 1,
    title: 'Cocina Mediterránea: Técnicas y Secretos',
    level: 'Nivel Intermedio - $$$',
    students: 20,
    rating: 4.7,
    image: 'https://picsum.photos/317/200',
  },
  {
    id: 2,
    title: 'Cocina Mediterránea: Técnicas y Secretos',
    level: 'Nivel Intermedio - $$$',
    students: 20,
    rating: 4.8,
    image: 'https://picsum.photos/317/200',
  },
];

export default function CursoInscripcionScreen() {
  const [type] = useState<CourseType>('virtual');

  const getCourseDescription = () => {
    switch (type) {
      case 'virtual':
        return 'Clases en vivo por videoconferencia, interactúa con el instructor en tiempo real y accede a material digital.';
      case 'online':
        return 'Aprende a tu ritmo con contenido pre-grabado, material descargable y acceso ilimitado a las lecciones.';
      case 'presencial':
        return 'Clases presenciales en nuestro estudio, con equipamiento profesional y atención personalizada.';
      default:
        return '';
    }
  };

  const getEnrollButtonText = () => {
    switch (type) {
      case 'virtual':
        return 'Inscribirse';
      case 'online':
        return 'Comenzar Ahora';
      case 'presencial':
        return 'Reservar Cupo';
      default:
        return 'Inscribirse';
    }
  };

  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Image */}
        <Image source={{ uri: 'https://picsum.photos/462/462' }} style={styles.courseImage} />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Text style={styles.activeTab}>Resumen</Text>
          <Text style={styles.inactiveTab}>Detalles</Text>
        </View>

        {/* Course Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>6 semanas</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={20} color="#7E7E7E" />
              </View>
              <View>
                <Text style={styles.infoText}>2 horas</Text>
                <Text style={styles.infoSubtext}>semanales</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant-outline" size={20} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>intermedio</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={20} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Aprende desde cero las técnicas esenciales de la panadería artesanal. Descubre cómo hacer panes crujientes, esponjosos y llenos de sabor utilizando ingredientes naturales y procesos tradicionales.
        </Text>

        {/* Content Section */}
        <Text style={styles.sectionTitle}>Contenido</Text>
        <Text style={styles.contentDescription}>
          {getCourseDescription()}
        </Text>

        {/* Course Modules */}
        <View style={styles.modulesContainer}>
          {[
            'Introducción a la panadería artesanal',
            'Manejo de masas y fermentación',
            'Técnicas de amasado y formado',
            'Elaboración de panes clásicos',
            'Panes especiales y de masa madre',
            'Horneado y presentación final',
          ].map((module, index) => (
            <View key={index} style={styles.moduleItem}>
              <Text style={styles.moduleNumber}>{index + 1}.</Text>
              <Text style={styles.moduleTitle}>{module}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients Section - Only show for virtual and presencial */}
        {(type === 'virtual' || type === 'presencial') && (
          <>
            <Text style={styles.sectionTitle}>Ingredientes Necesarios</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsContainer}>
              {ingredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredientCard}>
                  <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Utensils Section - Only show for virtual and presencial */}
        {(type === 'virtual' || type === 'presencial') && (
          <>
            <Text style={styles.sectionTitle}>Utensilios Recomendados</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.utensilsContainer}>
              {utensils.map((utensil) => (
                <View key={utensil.id} style={styles.utensilCard}>
                  <Image source={{ uri: utensil.image }} style={styles.utensilImage} />
                  <View style={styles.utensilInfo}>
                    <Text style={styles.utensilName}>{utensil.name}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Related Courses Section */}
        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}>
            <Text style={styles.relatedTitle}>Cursos Relacionados</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>Ver mas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedCoursesContainer}>
            {relatedCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image }} style={styles.courseCardImage} />
                <View style={styles.courseCardInfo}>
                  <Text style={styles.courseCardTitle}>{course.title}</Text>
                  <Text style={styles.courseCardLevel}>{course.level}</Text>
                  <View style={styles.courseCardFooter}>
                    <View style={styles.courseCardStats}>
                      <Ionicons name="people-outline" size={13} color="#CAC8C8" />
                      <Text style={styles.courseCardStatText}>{course.students}</Text>
                    </View>
                    <View style={styles.courseCardRating}>
                      <Text style={styles.courseCardRatingText}>{course.rating}</Text>
                      <Ionicons name="star" size={12} color="#CAC8C8" />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Enroll Button */}
      <TouchableOpacity style={styles.enrollButton}>
        <Text style={styles.enrollButtonText}>{getEnrollButtonText()}</Text>
        <Ionicons name="arrow-forward" size={23} color="#FFFFFF" />
      </TouchableOpacity>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 28,
  },
  courseImage: {
    width: '100%',
    height: 462,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activeTab: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    marginRight: 16,
  },
  inactiveTab: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: 'rgba(27,27,27,0.62)',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoColumn: {
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 34,
    height: 34,
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#7E7E7E',
  },
  infoSubtext: {
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
  },
  description: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 16,
  },
  contentDescription: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    marginBottom: 24,
  },
  modulesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
  },
  moduleNumber: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    marginRight: 8,
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
  },
  ingredientsContainer: {
    marginBottom: 24,
  },
  ingredientCard: {
    width: 113,
    height: 177,
    marginRight: 16,
    backgroundColor: 'rgba(238,150,75,0.6)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  ingredientImage: {
    width: '100%',
    height: 93,
    resizeMode: 'cover',
  },
  ingredientInfo: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  ingredientName: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 14,
  },
  ingredientAmount: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
  utensilsContainer: {
    marginBottom: 24,
  },
  utensilCard: {
    width: 113,
    height: 177,
    marginRight: 16,
    backgroundColor: 'rgba(13,59,102,0.4)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  utensilImage: {
    width: '100%',
    height: 93,
    resizeMode: 'cover',
  },
  utensilInfo: {
    padding: 8,
    flex: 1,
    justifyContent: 'center',
  },
  utensilName: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 14,
  },
  relatedSection: {
    marginBottom: 100,
  },
  relatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2F2F2F',
  },
  seeMoreText: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#888888',
  },
  relatedCoursesContainer: {
    gap: 16,
  },
  courseCard: {
    width: 317,
    height: 211,
    marginRight: 16,
    borderRadius: 30,
    overflow: 'hidden',
  },
  courseCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  courseCardInfo: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(29,29,29,0.4)',
    borderRadius: 15,
    padding: 11,
  },
  courseCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 4,
  },
  courseCardLevel: {
    color: '#CAC8C8',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 8,
  },
  courseCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseCardStatText: {
    color: '#CAC8C8',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  courseCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseCardRatingText: {
    color: '#CAC8C8',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  enrollButton: {
    position: 'absolute',
    bottom: 38,
    left: 28,
    right: 28,
    height: 66,
    backgroundColor: '#EE964B',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 13,
    },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 5,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
}); 