import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import CustomScreenView from '../../components/CustomScreenView';

export default function PerfilScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <Header 
        title="Perfil"
        subtitle="Tu información personal"
      />

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://picsum.photos/200/200' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Juan Pérez</Text>
          <Text style={styles.profileEmail}>juan.perez@email.com</Text>
          
          <Button
            variant="outline"
            size="medium"
            title="Editar perfil"
            icon="create-outline"
            onPress={() => {}}
          />
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Cursos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Recetas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Certificados</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progreso general</Text>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Cursos completados</Text>
              <Text style={styles.progressValue}>4/12</Text>
            </View>
            <ProgressBar progress={0.33} style={styles.progressBar} />
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Recetas guardadas</Text>
              <Text style={styles.progressValue}>15/45</Text>
            </View>
            <ProgressBar progress={0.33} style={styles.progressBar} />
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={24} color="#2F2F2F" />
            <Text style={styles.menuText}>Recetas guardadas</Text>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="trophy-outline" size={24} color="#2F2F2F" />
            <Text style={styles.menuText}>Certificados</Text>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#2F2F2F" />
            <Text style={styles.menuText}>Configuración</Text>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#2F2F2F" />
            <Text style={styles.menuText}>Ayuda y soporte</Text>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <Button
          variant="secondary"
          size="large"
          title="Cerrar sesión"
          icon="log-out-outline"
          onPress={() => {}}
          style={styles.logoutButton}
        />
      </ScrollView>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  progressSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    color: '#2F2F2F',
  },
  progressValue: {
    fontSize: 14,
    color: '#888',
  },
  progressBar: {
    marginBottom: 8,
  },
  menuSection: {
    padding: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2F2F2F',
    marginLeft: 16,
  },
  logoutButton: {
    margin: 24,
  },
}); 