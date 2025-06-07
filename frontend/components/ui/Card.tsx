import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  type: 'recipe' | 'course';
  title: string;
  subtitle?: string;
  image: string;
  rating?: number;
  time?: string;
  level?: string;
  students?: number;
  onPress?: () => void;
}

export default function Card({
  type,
  title,
  subtitle,
  image,
  rating,
  time,
  level,
  students,
  onPress,
}: CardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, type === 'recipe' ? styles.recipeCard : styles.courseCard]}
      onPress={onPress}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        
        <View style={styles.metaContainer}>
          {type === 'recipe' ? (
            <>
              {time && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.metaText}>{time}</Text>
                </View>
              )}
              {rating && (
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{rating}</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {level && <Text style={styles.level}>{level}</Text>}
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={14} color="#fff" />
                <Text style={styles.metaText}>{students}</Text>
              </View>
              {rating && (
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.metaText}>{rating}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recipeCard: {
    width: 220,
    height: 260,
    marginRight: 16,
  },
  courseCard: {
    width: 220,
    height: 120,
    marginRight: 16,
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    color: '#CAC8C8',
    fontSize: 13,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 13,
  },
  level: {
    color: '#FFD700',
    fontSize: 12,
    marginBottom: 4,
  },
}); 