import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import CustomScreenView from '@/components/CustomScreenView';

export default function CursoModuloScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Module Image */}
        <Image source={{ uri: 'https://picsum.photos/205' }} style={styles.moduleImage} />

        {/* Module Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.moduleTitle}>1 - Introducción a la panadería artesanal</Text>
        </View>

        {/* Duration */}
        <Text style={styles.duration}>Duración estimada: 45 minutos</Text>

        {/* Quote */}
        <Text style={styles.quote}>
          &quot;La clave de una buena panadería está en el respeto por los tiempos de fermentación.&quot;
        </Text>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>📖 Introducción a la Panadería Artesanal</Text>
          <Text style={styles.contentText}>
            La panadería artesanal es mucho más que una técnica de cocina: es una forma de respetar los procesos naturales de fermentación, de valorar ingredientes simples y de volver a las raíces de una tradición milenaria.
          </Text>
          <Text style={styles.contentText}>
            A diferencia de la panadería industrial, el enfoque artesanal pone énfasis en:
          </Text>
          <Text style={styles.contentText}>
            • El uso de ingredientes de calidad, sin aditivos ni conservantes.{'\n'}
            • La fermentación lenta, que mejora la textura, el sabor y la digestibilidad del pan.{'\n'}
            • El trabajo manual, cuidando cada etapa del amasado y la cocción.
          </Text>

          <Text style={styles.sectionTitle}>🌾 Ingredientes fundamentales</Text>
          <Text style={styles.contentText}>
            • Harina: puede ser de trigo, centeno, espelta, etc. Aporta la estructura al pan.{'\n'}
            • Agua: activa la levadura y une los ingredientes.{'\n'}
            • Sal: realza el sabor y regula la fermentación.{'\n'}
            • Levadura o masa madre: el agente fermentador que hace crecer la masa.
          </Text>

          <Text style={styles.sectionTitle}>🕰️ Fermentación: El alma del pan</Text>
          <Text style={styles.contentText}>
            Una de las claves de la panadería artesanal es respetar el tiempo. La fermentación lenta, de varias horas o incluso días, permite que el pan desarrolle un sabor profundo, una miga aireada y una corteza crujiente.
          </Text>
          <Text style={styles.contentText}>
            Existen dos tipos principales:{'\n'}
            • Fermentación con levadura comercial, más rápida.{'\n'}
            • Fermentación con masa madre, más lenta pero con resultados únicos.
          </Text>

          <Text style={styles.sectionTitle}>🍞 Filosofía slow food</Text>
          <Text style={styles.contentText}>
            Este módulo se basa en el principio de &quot;comida lenta&quot;, un movimiento que promueve alimentos hechos con conciencia, tiempo y respeto por la tradición. El pan artesanal es un símbolo de este enfoque: nutritivo, sabroso y sostenible.
          </Text>

          <Text style={styles.sectionTitle}>✅ Conclusión</Text>
          <Text style={styles.contentText}>
            Este primer módulo busca que comprendas la base del oficio panadero. En los siguientes encuentros, vamos a comenzar a preparar nuestras primeras masas, aprender técnicas de amasado y horneado, y profundizar en las recetas clásicas.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.back()}
          >
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]}
            onPress={() => router.push('/receta-pasos')}
          >
            <Text style={[styles.navButtonText, styles.nextButtonText]}>Siguiente</Text>
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
  moduleImage: {
    width: 205,
    height: 205,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  moduleTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#1B1B1B',
  },
  duration: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    marginBottom: 16,
  },
  quote: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#A5A5A5',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  contentContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#3F3F3F',
  },
  contentText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#A5A5A5',
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 24,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  nextButton: {
    backgroundColor: '#1B1B1B',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#1B1B1B',
  },
  nextButtonText: {
    color: '#FFFFFF',
  },
}); 