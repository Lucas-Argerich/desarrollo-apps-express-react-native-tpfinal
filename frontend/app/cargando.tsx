import CustomScreenView from '@/components/CustomScreenView';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function CargandoScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.logoFrame}>
          <ThemedText type="logo" style={styles.logoText}>Foody</ThemedText>
        </View>
        <ThemedText type="subtitle" style={styles.loadingText}>¡Tus platos favoritos están casi listos!</ThemedText>
      </View>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0CA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 100,
  },
  logoFrame: {
    width: 245,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoText: {
    color: '#EE964B',
    fontSize: 64,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  loadingText: {
    fontWeight: 'bold',
    width: 240,
    color: '#EE964B',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
}); 