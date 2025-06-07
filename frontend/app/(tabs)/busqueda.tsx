import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import Header from '../../components/ui/Header';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import CustomScreenView from '../../components/CustomScreenView';

type FilterType = 'todos' | 'recetas' | 'cursos' | 'ingredientes';

export default function BusquedaScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: FilterType[] = ['todos', 'recetas', 'cursos', 'ingredientes'];

  return (
    <CustomScreenView style={styles.container}>
      <Header 
        title="Búsqueda"
        subtitle="Encontrá lo que buscás"
      />
      
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => {}}
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterTabs}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.resultsContainer}>
        {activeFilter === 'recetas' && (
          <>
            <Card
              type="recipe"
              title="Hamburguesa Triple"
              subtitle="Con queso cheddar y bacon"
              image="https://picsum.photos/200/302"
              rating={4.7}
              time="45 min"
              onPress={() => {}}
            />
            <Card
              type="recipe"
              title="Pizza Margherita"
              subtitle="Receta tradicional italiana"
              image="https://picsum.photos/200/303"
              rating={4.9}
              time="30 min"
              onPress={() => {}}
            />
          </>
        )}

        {activeFilter === 'cursos' && (
          <>
            <Card
              type="course"
              title="Cocina Italiana"
              subtitle="Aprende los secretos de la pasta"
              image="https://picsum.photos/200/300"
              rating={4.8}
              level="Principiante"
              students={1200}
              onPress={() => {}}
            />
            <Card
              type="course"
              title="Pastelería Francesa"
              subtitle="Delicias dulces"
              image="https://picsum.photos/200/301"
              rating={4.9}
              level="Intermedio"
              students={850}
              onPress={() => {}}
            />
          </>
        )}
      </ScrollView>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterTabs: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  activeFilterTab: {
    backgroundColor: '#EE964B',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
}); 
