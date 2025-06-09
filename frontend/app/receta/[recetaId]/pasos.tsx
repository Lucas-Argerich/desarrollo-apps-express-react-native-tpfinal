import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomScreenView from '@/components/CustomScreenView';

const ingredients = [
  { id: '1', name: '2 Medallones de Carne Vacuna', amount: '120g c/u', image: 'https://picsum.photos/113/93' },
  { id: '2', name: '2 Fetas de Cheddar', image: 'https://picsum.photos/113/93' },
  { id: '3', name: '1 Pan Brioche', amount: '80g c/u', image: 'https://picsum.photos/113/93' },
  { id: '4', name: '2 Hoja de Lechuga', image: 'https://picsum.photos/113/93' },
  { id: '5', name: '2 Rodajas de Tomate', image: 'https://picsum.photos/113/93' },
  { id: '6', name: '4 Rodajas de Pepinillos', image: 'https://picsum.photos/113/93' },
  { id: '7', name: '1 Cucharada de Mayonesa', amount: '15g c/u', image: 'https://picsum.photos/113/93' },
  { id: '8', name: '1 Cucharada de Ketchup', amount: '15g c/u', image: 'https://picsum.photos/113/93' },
  { id: '9', name: '1 Cuchara de Mostaza', amount: '5g c/u', image: 'https://picsum.photos/113/93' },
  { id: '10', name: '1 Cuchara de Manteca', amount: '10g c/u', image: 'https://picsum.photos/113/93' },
];

export default function RecetaPasosScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Step Image */}
        <Image source={{ uri: 'https://picsum.photos/243/243' }} style={styles.stepImage} />

        {/* Navigation Header */}
        <View style={styles.navigationHeader}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#1B1B1B" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Preparar los ingredientes</Text>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#1B1B1B" />
          </TouchableOpacity>
        </View>

        {/* Step Description */}
        <Text style={styles.stepDescription}>
          Lava la lechuga y el tomate. Corta las rodajas de tomate y los pepinillos. Reservá todo listo para el armado.
        </Text>

        {/* Ingredients Section */}
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.ingredientsGrid}>
          {ingredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientCard}>
              <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                {ingredient.amount && (
                  <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stepImage: {
    width: '100%',
    height: 243,
    resizeMode: 'cover',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
  },
  stepDescription: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 24,
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    paddingHorizontal: 28,
    marginBottom: 16,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 28,
    gap: 16,
    marginBottom: 24,
  },
  ingredientCard: {
    width: 113,
    height: 177,
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
}); 