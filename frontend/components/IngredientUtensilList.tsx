import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

interface Item {
  idUtilizado: number
  cantidad: number
  unidad: string
  nombre: string
}

interface Props {
  title: string
  items: Item[]
  servings?: number
  originalServings?: number
  scaledIndicatorLabel?: string
}

export default function IngredientUtensilList({
  title,
  items,
  servings,
  originalServings,
  scaledIndicatorLabel = 'ajustado para'
}: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>
        {title}
        {(servings ?? 0) !== originalServings && servings && (
          <Text style={styles.scaledIndicator}>
            {' '}
            ({scaledIndicatorLabel} {servings} persona{servings > 1 ? 's' : ''})
          </Text>
        )}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.idUtilizado.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.ingredientCard}>
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientAmount}>
                {item.cantidad} <Text style={styles.unitText}>{item.unidad}</Text>
              </Text>
            </View>
            <Text style={styles.ingredientName}>{item.nombre}</Text>
          </View>
        )}
        style={{ marginLeft: 24 }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 24,
    marginTop: 24
  },
  scaledIndicator: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400'
  },
  horizontalList: {
    gap: 12,
    marginBottom: 18
  },
  ingredientCard: {
    backgroundColor: '#EE964B',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    width: 100,
    height: 110,
  },
  ingredientInfo: {
    flex: 1
  },
  unitText: {
    fontSize: 20
  },
  ingredientAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
    marginTop: 8
  },
  ingredientName: {
    fontSize: 15,
    color: '#fff',
    marginTop: 2,
  }
}) 