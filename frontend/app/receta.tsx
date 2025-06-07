import React, { useState } from 'react';
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

const reviews = [
  {
    id: '1',
    text: '"Seguí los pasos al pie de la letra y la hamburguesa salió espectacular. Jugosa, sabrosa y perfecta. ¡La volveré a hacer!"',
    author: 'Martín Rodríguez',
    rating: 5,
  },
  {
    id: '2',
    text: '"Me encantó la receta, aunque le puse un poco más de especias para darle más sabor. Fácil de preparar y perfecta para una comida casera."',
    author: 'Ana Gómez',
    rating: 4,
  },
];

export default function RecetaScreen() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [servings, setServings] = useState(1);

  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={{ uri: 'https://picsum.photos/462/374' }} style={styles.heroImage} />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'resumen' && styles.activeTab]} 
            onPress={() => setActiveTab('resumen')}
          >
            <Text style={[styles.tabText, activeTab === 'resumen' && styles.activeTabText]}>Resumen</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'detalles' && styles.activeTab]} 
            onPress={() => setActiveTab('detalles')}
          >
            <Text style={[styles.tabText, activeTab === 'detalles' && styles.activeTabText]}>Detalles</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>1 hora</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>fácil</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>1 persona</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={16} color="#7E7E7E" />
              </View>
              <Text style={styles.infoText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Una jugosa hamburguesa doble con dos medallones de carne perfectamente sazonados, queso cheddar derretido, lechuga fresca, tomate y una salsa especial en un pan brioche dorado. La combinación ideal entre sabor casero y toque gourmet, perfecta para cualquier momento del día.
        </Text>

        {/* Ingredients */}
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

        {/* Servings Counter */}
        <View style={styles.servingsContainer}>
          <TouchableOpacity 
            style={[styles.servingsButton, styles.minusButton]} 
            onPress={() => setServings(Math.max(1, servings - 1))}
          >
            <Ionicons name="remove" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.servingsDisplay}>
            <Text style={styles.servingsText}>{servings}</Text>
            <Ionicons name="person" size={20} color="#A5A5A5" />
          </View>
          <TouchableOpacity 
            style={[styles.servingsButton, styles.plusButton]} 
            onPress={() => setServings(servings + 1)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Opiniones</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Text style={styles.reviewText}>{review.text}</Text>
            <View style={styles.reviewFooter}>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons 
                    key={i} 
                    name={i < review.rating ? "star" : "star-outline"} 
                    size={16} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <View style={styles.reviewDivider} />
              <Text style={styles.reviewAuthor}>{review.author}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver todas</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Empezar</Text>
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroImage: {
    width: '100%',
    height: 374,
    resizeMode: 'cover',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingTop: 28,
    gap: 16,
  },
  tab: {
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1B1B1B',
  },
  tabText: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: 'rgba(27,27,27,0.62)',
  },
  activeTabText: {
    color: '#1B1B1B',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
  },
  infoColumn: {
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 34,
    height: 34,
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#7E7E7E',
  },
  description: {
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
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  servingsButton: {
    width: 48,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButton: {
    backgroundColor: 'rgba(238,150,75,0.4)',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  plusButton: {
    backgroundColor: '#EE964B',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  servingsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  servingsText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#A5A5A5',
  },
  reviewCard: {
    marginHorizontal: 28,
    padding: 21,
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewText: {
    color: '#A5A5A5',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewDivider: {
    width: 12,
    height: 1,
    backgroundColor: '#7E7E7E',
    marginHorizontal: 8,
  },
  reviewAuthor: {
    color: '#7E7E7E',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
  viewAllButton: {
    paddingHorizontal: 28,
    marginBottom: 100,
  },
  viewAllText: {
    color: 'rgba(27,27,27,0.62)',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
  },
  startButton: {
    position: 'absolute',
    bottom: 38,
    left: 28,
    right: 28,
    height: 66,
    backgroundColor: '#EE964B',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 13,
    },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
}); 