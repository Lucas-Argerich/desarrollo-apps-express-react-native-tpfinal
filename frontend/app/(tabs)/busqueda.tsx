import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator, View, FlatList } from 'react-native';
import Header from '../../components/ui/Header';
import SearchBar from '../../components/ui/SearchBar';
import CustomScreenView from '../../components/CustomScreenView';
import { api } from '@/services/api';
import { Curso, Receta } from '@/utils/types';
import SearchResult from '@/components/SearchResult';

// Types for API response
interface SearchResultApi {
  recipes: Receta[];
  courses: Curso[];
}

type FilterType = 'todos' | 'recetas' | 'cursos' | 'ingredientes';

type MixedResult =
  | ({ type: 'course'; data: Curso })
  | ({ type: 'recipe'; data: Receta });

export default function BusquedaScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResultApi>({ recipes: [], courses: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const filters: FilterType[] = ['todos', 'recetas', 'cursos', 'ingredientes'];

  useEffect(() => {
    if (!searchQuery) {
      setResults({ recipes: [], courses: [] });
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    let typeParam = undefined;
    if (activeFilter === 'recetas') typeParam = 'recipe';
    if (activeFilter === 'cursos') typeParam = 'course';
    // ingredientes not supported in backend, so skip
    api('/search', 'GET', {
      query: {
        q: searchQuery,
        ...(typeParam ? { type: typeParam } : {}),
        limit: 10,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setResults({ recipes: [], courses: [] });
        setLoading(false);
      });
  }, [searchQuery, activeFilter]);

  // Merge and tag results
  let mixedResults: MixedResult[] = [];
  if (activeFilter === 'todos') {
    mixedResults = [
      ...results.courses.map((c) => ({ type: 'course' as const, data: c })),
      ...results.recipes.map((r) => ({ type: 'recipe' as const, data: r })),
    ];
  } else if (activeFilter === 'recetas') {
    mixedResults = results.recipes.map((r) => ({ type: 'recipe' as const, data: r }));
  } else if (activeFilter === 'cursos') {
    mixedResults = results.courses.map((c) => ({ type: 'course' as const, data: c }));
  }

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

      <View style={styles.resultsContainer}>
        {loading && (
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#EE964B" />
          </View>
        )}
        {!loading && searched && (
          <>
            {activeFilter === 'ingredientes' ? (
              <Text style={{ marginTop: 32, textAlign: 'center', color: '#888' }}>La búsqueda de ingredientes no está disponible.</Text>
            ) : mixedResults.length === 0 ? (
              <Text style={{ marginTop: 32, textAlign: 'center', color: '#888' }}>No se encontraron resultados.</Text>
            ) : (
              <FlatList
                data={mixedResults}
                keyExtractor={(_, idx) => idx.toString()}
                numColumns={2}
                renderItem={({ item }) => <SearchResult result={item} />}
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}
        {!loading && !searched && (
          <Text style={{ marginTop: 32, textAlign: 'center', color: '#888' }}>Buscá recetas o cursos usando la barra de búsqueda.</Text>
        )}
      </View>
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
    marginVertical: 8,
    flexGrow: 0
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
