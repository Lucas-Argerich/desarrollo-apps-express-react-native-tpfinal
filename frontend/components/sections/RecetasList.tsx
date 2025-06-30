import {
  FlatList,
  View,
  StyleSheet,
  Animated,
  ViewProps
} from 'react-native'
import RecipeCard from '../RecipeCard'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Receta } from '@/utils/types'
import Tabs from '../ui/Tabs'
import SectionHeader from '../ui/SectionHeader'

interface RecetasListProps extends ViewProps {
  title?: string
}

const recipeTabs = ['Mas Vistos', 'Ultimos']

export default function RecetasList({ title, style, ...props }: RecetasListProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [recipes, setRecipes] = useState<Receta[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoading) return
    setIsLoading(true)

    api('/recipes', 'GET', {
      query: {
        sort: ['saves', 'latest'][activeTab]
      }
    })
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .finally(() => setIsLoading(false))
  }, [activeTab])

  return (
    <View style={style} {...props}>
      <SectionHeader title={title ?? 'Explorá Recetas'} />
      {/* Tabs */}
      <Tabs tabs={recipeTabs} activeTab={activeTab} onTabPress={(_, idx) => setActiveTab(idx)} />
      {/* Placeholder Animation */}
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ minHeight: 305 }}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={() => <RecipeSkeleton />}
        />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idReceta.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ minHeight: 305 }}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
        />
      )}
    </View>
  )
}

function RecipeSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={styles.skeletonImage} />
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonMetaRow}>
          <View style={styles.skeletonMeta} />
          <View style={styles.skeletonMeta} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  skeletonCard: {
    width: 220,
    height: 305,
    borderRadius: 24,
    backgroundColor: '#ececec',
    marginRight: 16,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  skeletonImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#e0e0e0'
  },
  skeletonInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end'
  },
  skeletonTitle: {
    width: '80%',
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 12
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skeletonMeta: {
    width: 40,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 6
  }
})
