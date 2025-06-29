import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomScreenView from '@/components/CustomScreenView'
import RecetasList from '@/components/sections/RecetasList'
import CursosList from '@/components/sections/CursosList'

export default function InicioScreen() {
  return (
    <CustomScreenView style={{ flex: 1, backgroundColor: '#fff' }}>
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

      {/* Recetas Section */}
      <RecetasList />
      
      {/* Cursos Destacados Section */}
      <CursosList />

      <View style={{ height: 100 }} />
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
