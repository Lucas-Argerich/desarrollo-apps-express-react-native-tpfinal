import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import CustomScreenView from '../components/CustomScreenView';

const courses = [
  {
    id: 1,
    title: 'Cocina Mediterránea: Técnicas y Secretos',
    level: 'Nivel Intermedio - $$$',
    students: 20,
    rating: 4.7,
    image: 'https://picsum.photos/317/200',
  },
  {
    id: 2,
    title: 'Cocina Mediterránea: Técnicas y Secretos',
    level: 'Nivel Intermedio - $$$',
    students: 20,
    rating: 4.8,
    image: 'https://picsum.photos/317/200',
  },
];

const recipes = [
  {
    id: 1,
    title: 'Ensalada Tropical',
    type: 'Receta',
    rating: 4.8,
    image: 'https://picsum.photos/177/240',
  },
  {
    id: 2,
    title: 'Ensalada Tropical',
    type: 'Receta',
    rating: 4.8,
    image: 'https://picsum.photos/177/240',
  },
  {
    id: 3,
    title: 'Ensalada Tropical',
    type: 'Receta',
    rating: 4.8,
    image: 'https://picsum.photos/177/240',
  },
  {
    id: 4,
    title: 'Ensalada Tropical',
    type: 'Receta',
    rating: 4.8,
    image: 'https://picsum.photos/177/240',
  },
];

export default function RecetarioScreen() {
  return (
    <CustomScreenView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Mi Recetario</Text>
            <Image source={{ uri: 'https://picsum.photos/50/50' }} style={styles.profileImage} />
          </View>
          <Text style={styles.subtitle}>Tus cursos y recetas favoritas en un solo lugar</Text>
        </View>

        {/* My Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Cursos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesContainer}>
            {courses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image }} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseLevel}>{course.level}</Text>
                  </View>
                  <View style={styles.courseFooter}>
                    <View style={styles.studentsContainer}>
                      <Image source={{ uri: 'https://picsum.photos/13/13' }} style={styles.icon} />
                      <View style={styles.studentsInfo}>
                        <Text style={styles.studentsCount}>{course.students}</Text>
                        <Image source={{ uri: 'https://picsum.photos/12/12' }} style={styles.userIcon} />
                      </View>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.rating}>{course.rating}</Text>
                      <Image source={{ uri: 'https://picsum.photos/12/12' }} style={styles.starIcon} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* My Recipes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Recetas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recipesGrid}>
            {recipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <View style={styles.recipeHeader}>
                    <View style={styles.recipeTitleContainer}>
                      <Text style={styles.recipeTitle}>{recipe.title}</Text>
                      <Text style={styles.recipeType}>{recipe.type}</Text>
                    </View>
                    <View style={styles.recipeRating}>
                      <Text style={styles.rating}>{recipe.rating}</Text>
                      <Image source={{ uri: 'https://picsum.photos/12/12' }} style={styles.starIcon} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.allRecipesButton}>
            <Text style={styles.allRecipesText}>Todas mis recetas</Text>
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
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    color: '#2F2F2F',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#888888',
    letterSpacing: 0.08,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2F2F2F',
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#888888',
  },
  coursesContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  courseCard: {
    width: 317,
    height: 211,
    borderRadius: 30,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  courseHeader: {
    backgroundColor: 'rgba(29,29,29,0.4)',
    borderRadius: 15,
    padding: 11,
    marginBottom: 11,
  },
  courseTitle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  courseLevel: {
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#CAC8C8',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 13,
    height: 13,
  },
  studentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentsCount: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#CAC8C8',
  },
  userIcon: {
    width: 12,
    height: 12,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#CAC8C8',
  },
  starIcon: {
    width: 12,
    height: 12,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  recipeCard: {
    width: 177,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 6,
  },
  recipeHeader: {
    backgroundColor: 'rgba(29,29,29,0.4)',
    borderRadius: 10,
    padding: 11,
  },
  recipeTitleContainer: {
    flex: 1,
    marginBottom: 4,
  },
  recipeTitle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recipeType: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#CAC8C8',
  },
  recipeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allRecipesButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 14,
  },
  allRecipesText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#888888',
  },
}); 