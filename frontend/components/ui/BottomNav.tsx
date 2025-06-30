import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  return (
    <BlurView intensity={20} style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('index')}
      >
        <Ionicons name="home-outline" size={23} color="#2F2F2F" />
        <View style={styles.activeDot} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('busqueda')}
      >
        <Ionicons name="search-outline" size={23} color="#2F2F2F" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.recetarioButton}
        onPress={() => navigation.navigate('recetario')}
      >
        <Ionicons name="book-outline" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('recientes')}
      >
        <Ionicons name="time-outline" size={23} color="#2F2F2F" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('perfil')}
      >
        <Ionicons name="person-outline" size={23} color="#2F2F2F" />
      </TouchableOpacity>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 48,
    backgroundColor: 'rgba(255,255,255,0.90)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    width: 23,
    alignItems: 'center',
    gap: 9,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EE964B',
    position: 'absolute',
    left: 7.5,
    top: 28,
  },
  recetarioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EE964B',
    borderRadius: 10000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    transform: [{ translateY: -6 }],
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 5,
  },
}); 