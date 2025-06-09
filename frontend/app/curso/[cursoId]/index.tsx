import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import CustomScreenView from '@/components/CustomScreenView';

type CourseType = 'virtual' | 'online' | 'presencial';

const modules = [
  'Introducción a la panadería artesanal',
  'Manejo de masas y fermentación',
  'Técnicas de amasado y formado',
  'Elaboración de panes clásicos',
  'Panes especiales y de masa madre',
  'Horneado y presentación final',
];

export default function CursoScreen() {
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

  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Image */}
        <Image source={{ uri: 'https://picsum.photos/462/462' }} style={styles.courseImage} />

        {/* Content Section */}
        <Text style={styles.sectionTitle}>Contenido</Text>
        <Text style={styles.contentDescription}>
          {getCourseDescription()}
        </Text>

        {/* Course Modules */}
        <View style={styles.modulesContainer}>
          {modules.map((module, index) => (
            <View key={index} style={styles.moduleItem}>
              <Text style={styles.moduleNumber}>{index + 1}.</Text>
              <Text style={styles.moduleTitle}>{module}</Text>
            </View>
          ))}
        </View>

        {/* View Content Button */}
        <TouchableOpacity 
          style={styles.viewContentButton}
          onPress={() => router.push('/curso/1/contenido')}
        >
          <Text style={styles.viewContentButtonText}>Ver contenido</Text>
        </TouchableOpacity>
      </ScrollView>
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
  viewContentButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  viewContentButtonText: {
    color: '#1B1B1B',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
}); 