import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import CustomScreenView from '../../components/CustomScreenView';

export default function RecientesScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <Header 
        title="Recientes"
        subtitle="Tus últimas actividades"
      />

      <ScrollView style={styles.content}>
        <SectionHeader 
          title="Continuar curso"
          showSeeMore={false}
        />
        
        <TouchableOpacity 
          style={styles.continueCourse}
          onPress={() => router.push('/curso')}
        >
          <Image 
            source={{ uri: 'https://picsum.photos/200/300' }}
            style={styles.courseImage}
          />
          <View style={styles.courseInfo}>
            <View style={styles.courseHeader}>
              <View style={styles.courseType}>
                <Text style={styles.courseTypeText}>Curso</Text>
              </View>
              <Text style={styles.courseTitle}>Cocina Italiana</Text>
            </View>
            <Text style={styles.courseSubtitle}>Módulo 2: Pastas Frescas</Text>
            <ProgressBar progress={0.4} style={styles.progressBar} />
            <Text style={styles.progressText}>40% completado</Text>
          </View>
        </TouchableOpacity>

        <SectionHeader 
          title="Recetas recientes"
          onSeeMorePress={() => router.push('/recetario')}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesContainer}>
          <Card
            type="recipe"
            title="Hamburguesa Triple"
            subtitle="Con queso cheddar y bacon"
            image="https://picsum.photos/200/302"
            rating={4.7}
            time="45 min"
            onPress={() => router.push('/receta')}
          />
          <Card
            type="recipe"
            title="Pizza Margherita"
            subtitle="Receta tradicional italiana"
            image="https://picsum.photos/200/303"
            rating={4.9}
            time="30 min"
            onPress={() => router.push('/receta')}
          />
        </ScrollView>

        <SectionHeader 
          title="Búsquedas recientes"
          onSeeMorePress={() => {}}
        />
        
        <View style={styles.searchesContainer}>
          <TouchableOpacity style={styles.searchItem}>
            <Ionicons name="time-outline" size={20} color="#888" />
            <Text style={styles.searchText}>pasta carbonara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchItem}>
            <Ionicons name="time-outline" size={20} color="#888" />
            <Text style={styles.searchText}>recetas vegetarianas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchItem}>
            <Ionicons name="time-outline" size={20} color="#888" />
            <Text style={styles.searchText}>cursos de repostería</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  continueCourse: {
    margin: 16,
    backgroundColor: '#222',
    borderRadius: 24,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 160,
  },
  courseInfo: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseType: {
    backgroundColor: '#EE964B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  courseTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  courseTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseSubtitle: {
    color: '#CAC8C8',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    marginBottom: 8,
  },
  progressText: {
    color: '#CAC8C8',
    fontSize: 12,
  },
  recipesContainer: {
    paddingLeft: 16,
    marginTop: 8,
  },
  searchesContainer: {
    padding: 16,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2F2F2F',
  },
}); 