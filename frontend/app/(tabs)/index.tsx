import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'

const recipeTabs = ['Recomendados', 'Mas Vistos', 'Ultimos']
const recipeData = [
  {
    id: '1',
    title: 'Hamburguesa Triple Completa',
    subtitle: '',
    time: '2h',
    rating: '4.8',
    image: 'https://picsum.photos/id/270/405'
  },
  {
    id: '2',
    title: 'Caketorta,',
    subtitle: 'Tortería',
    time: '2h',
    rating: '4.8',
    image: 'https://picsum.photos/id/270/405'
  }
]
const courseData = [
  {
    id: '1',
    title: 'Cocina Mediterránea: Técnicas y Secretos',
    level: 'Nivel Intermedio - $$$',
    students: 20,
    rating: '4.7',
    image: 'https://picsum.photos/317/200'
  },
  {
    id: '2',
    title: 'Cocina Mediterránea: Técnicas y Secretos',
    level: 'Nivel Intermedio - $$$',
    students: 20,
    rating: '4.8',
    image: 'https://picsum.photos/317/200'
  }
]

export default function InicioScreen() {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <CustomScreenView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Bienvenido!</Text>
            <Text style={styles.headerSubtitle}>Explorá platos y culturas</Text>
          </View>
          <View style={styles.profilePicWrap}>
            <Image source={{ uri: 'https://picsum.photos/50/50' }} style={styles.profilePic} />
            <TouchableOpacity style={styles.loginIcon}>
              <View style={styles.loginIconBg}>
                <Ionicons name="log-in-outline" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput placeholder="Buscar recetas" style={{ flex: 1, fontSize: 16 }} />
          <Ionicons name="options-outline" size={22} color="#B0B0B0" />
        </View>
        {/* Recetas Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explorá Recetas</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Ver mas</Text>
          </TouchableOpacity>
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {recipeTabs.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === idx && styles.tabButtonActive]}
              onPress={() => setActiveTab(idx)}
            >
              <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Recipes Horizontal Scroll */}
        <FlatList
          data={recipeData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.recipeSubtitle}>{item.subtitle}</Text> : null}
                <View style={styles.recipeMeta}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.recipeMetaText}>{item.time}</Text>
                  <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
                  <Text style={styles.recipeMetaText}>{item.rating}</Text>
                </View>
              </View>
            </View>
          )}
        />
        {/* Cursos Destacados Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cursos Destacados</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Ver mas</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={courseData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
              <Image source={{ uri: item.image }} style={styles.courseImage} />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseLevel}>{item.level}</Text>
                <View style={styles.courseMeta}>
                  <Ionicons name="people-outline" size={14} color="#fff" />
                  <Text style={styles.courseMetaText}>{item.students}</Text>
                  <Ionicons name="star" size={14} color="#FFD700" style={{ marginLeft: 8 }} />
                  <Text style={styles.courseMetaText}>{item.rating}</Text>
                </View>
              </View>
            </View>
          )}
        />
        <View style={{ height: 100 }} />
      </ScrollView>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F'
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 2
  },
  profilePicWrap: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FAF0CA'
  },
  loginIcon: {
    position: 'absolute',
    left: 32,
    top: 22
  },
  loginIconBg: {
    width: 28,
    height: 28,
    backgroundColor: '#EE964B',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D2D2D2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F2F2F'
  },
  seeMore: {
    color: '#888',
    fontSize: 14
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4
  },
  tabButton: {
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    paddingHorizontal: 21,
    paddingVertical: 8,
    marginRight: 10
  },
  tabButtonActive: {
    backgroundColor: '#EE964B',
    shadowColor: '#FFA25B',
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  tabText: {
    color: '#C5C5C5',
    fontWeight: 'bold',
    fontSize: 15
  },
  tabTextActive: {
    color: '#fff'
  },
  recipeCard: {
    width: 220,
    height: 260,
    backgroundColor: '#222',
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  recipeImage: {
    width: '100%',
    height: 140
  },
  recipeInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end'
  },
  recipeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2
  },
  recipeSubtitle: {
    color: '#CAC8C8',
    fontSize: 13,
    marginBottom: 8
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  recipeMetaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 13
  },
  courseCard: {
    width: 220,
    height: 120,
    backgroundColor: '#222',
    borderRadius: 20,
    marginRight: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  courseImage: {
    width: 90,
    height: '100%'
  },
  courseInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  courseTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2
  },
  courseLevel: {
    color: '#FFD700',
    fontSize: 12,
    marginBottom: 4
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  courseMetaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12
  }
})
