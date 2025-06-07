import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomScreenView from '@/components/CustomScreenView';

export default function RecetaPuntuacionScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <Image source={{ uri: 'https://picsum.photos/243/243' }} style={styles.recipeImage} />

        {/* Completion Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.completionTitle}>¡Receta Completada!</Text>
          <Text style={styles.completionSubtitle}>
            ¿Cómo estuvo tu experiencia preparando esta receta?
          </Text>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Calificá tu experiencia:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#FFD700" : "#E1E1E1"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comment Section */}
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Haz un comentario..."
            placeholderTextColor="#848282"
            multiline
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Publish Button */}
        <TouchableOpacity style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Publicar Reseña</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Rehacer la Receta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 28,
  },
  recipeImage: {
    width: '100%',
    height: 243,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  headerContainer: {
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 21,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#1B1B1B',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  starButton: {
    padding: 4,
  },
  commentContainer: {
    height: 93,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#9A9A9A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#848282',
    textAlignVertical: 'top',
  },
  publishButton: {
    backgroundColor: '#EE964B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.15,
    shadowRadius: 19,
    elevation: 5,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#CAC8C8',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
}); 