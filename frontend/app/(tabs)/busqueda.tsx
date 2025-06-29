import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';
import SearchBar from '../../components/ui/SearchBar';
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
  
  // Ref to store the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const filters: FilterType[] = ['todos', 'recetas', 'cursos', 'ingredientes'];

  useEffect(() => {
    if (!searchQuery) {
      setResults({ recipes: [], courses: [] });
      setSearched(false);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

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
      signal: abortControllerRef.current.signal
    })
      .then((res) => {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        return res.json();
      })
      .then((data) => {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        console.log(data);
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        // Don't update state if request was aborted
        if (error.name === 'AbortError') {
          return;
        }
        setResults({ recipes: [], courses: [] });
        setLoading(false);
      });
  }, [searchQuery, activeFilter]);

  // Cleanup function to abort any pending requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  const renderResults = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EE964B" />
        </View>
      );
    }

    if (!searched) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>Buscá recetas o cursos usando la barra de búsqueda.</Text>
        </View>
      );
    }

    if (activeFilter === 'ingredientes') {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>La búsqueda de ingredientes no está disponible.</Text>
        </View>
      );
    }

    if (mixedResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>No se encontraron resultados.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={mixedResults}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        renderItem={({ item }) => <SearchResult result={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        contentContainerStyle={styles.filterTabsContent}
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
        {renderResults()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterTabs: {
    marginVertical: 8,
    flexGrow: 0
  },
  filterTabsContent: {
    paddingHorizontal: 16,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
}); 
