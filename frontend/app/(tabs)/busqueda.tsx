import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, ActivityIndicator, View, FlatList } from 'react-native';
import Header from '../../components/ui/Header';
import SearchBar from '../../components/ui/SearchBar';
import { api } from '@/services/api';
import { Curso, Receta } from '@/utils/types';
import SearchResult from '@/components/SearchResult';
import Tabs from '@/components/ui/Tabs';
import CustomScreenView from '@/components/CustomScreenView';

// Types for API response
type SearchResultApi = {
  recipes: { recipe: Receta, queryMatch: number }[];
  courses: { course: Curso, queryMatch: number }[];
};

type FilterType = 'todos' | 'recetas' | 'cursos' | 'ingredientes';

type MixedResult =
  | ({ type: 'course'; data: Curso, queryMatch: number })
  | ({ type: 'recipe'; data: Receta, queryMatch: number });

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
    // if (!searchQuery) {
    //   setResults({ recipes: [], courses: [] });
    //   setSearched(false);
    //   return;
    // }

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
    if (activeFilter === 'ingredientes') typeParam = 'ingrediente';
    
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
      ...results.courses.map((c) => ({ type: 'course' as const, data: c.course, queryMatch: c.queryMatch })),
      ...results.recipes.map((r) => ({ type: 'recipe' as const, data: r.recipe, queryMatch: r.queryMatch })),
    ];
  } else if (activeFilter === 'recetas') {
    mixedResults = results.recipes.map((r) => ({ type: 'recipe' as const, data: r.recipe, queryMatch: r.queryMatch }));
  } else if (activeFilter === 'cursos') {
    mixedResults = results.courses.map((c) => ({ type: 'course' as const, data: c.course, queryMatch: c.queryMatch }));
  } else if (activeFilter === 'ingredientes') {
    // Filter recipes that have the ingredient in their ingredients list
    mixedResults = [
      ...results.courses.map((c) => ({ type: 'course' as const, data: c.course, queryMatch: c.queryMatch })),
      ...results.recipes.map((r) => ({ type: 'recipe' as const, data: r.recipe, queryMatch: r.queryMatch })),
    ];  }
    console.log(mixedResults)
  mixedResults.sort((a, b) => b.queryMatch - a.queryMatch);

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

    if (activeFilter === 'ingredientes' && mixedResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>No se encontraron recetas con ese ingrediente.</Text>
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
        scrollEnabled={false}
        renderItem={({ item }) => <SearchResult result={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  return (
    <CustomScreenView style={styles.container}>
      <Header 
        title="Búsqueda"
        subtitle="Encontrá lo que buscás"
      />
      
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ marginVertical: 16 }}
      />

      {/* Tabs */}
      <Tabs
        tabs={filters}
        activeTab={filters.indexOf(activeFilter)}
        onTabPress={(_, idx) => setActiveFilter(filters[idx])}
      />

      <View style={styles.resultsContainer}>
        {renderResults()}
      </View>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center'
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
}); 
