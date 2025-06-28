import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import RecipeCard from '../RecipeCard'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Receta } from '@/utils/types'

const recipeTabs = ['Todas', 'Dulces', 'Saladas', 'Bebidas']

export default function RecetasList() {
  const [activeTab, setActiveTab] = useState(0)
  const [recipes, setRecipes] = useState<Receta[]>([])

  useEffect(() => {
    api('/recipes', 'GET', {}).then((data) => {
      console.log(data)
      setRecipes(data)
    })
  }, [])

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explorá Recetas</Text>
        <TouchableOpacity>
          <Text style={styles.seeMore}>Ver mas</Text>
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {recipeTabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === idx && styles.tabButtonActive]}
            onPress={() => setActiveTab(idx)}
          >
            <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Recipes Horizontal Scroll */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idReceta.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
          />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: { 
    fontSize: 20,
    fontWeight: 'bold'
  },
  seeMore: {
    color: '#007AFF',
    fontSize: 16
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0'
  },
  tabButtonActive: {
    backgroundColor: '#007AFF'
  },
  tabText: {
    color: '#666'
  },
  tabTextActive: {
    color: 'white'
  }
})
