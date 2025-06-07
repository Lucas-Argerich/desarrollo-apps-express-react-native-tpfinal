import CustomScreenView from '@/components/CustomScreenView';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CargandoScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.logoFrame}>
          <Text style={styles.logoText}>Foody</Text>
        </View>
        <Text style={styles.loadingText}>¡Tus platos favoritos están casi listos!</Text>
      </View>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0CA',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 30,
  },
  frame: {
    width: 252,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFrame: {
    width: 245,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoText: {
    color: '#EE964B',
    fontSize: 64,
    fontFamily: 'Pacifico', // Use a similar font or default if not available
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  loadingText: {
    color: '#EE964B',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 10,
  },
}); 