import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  profileImage?: string;
  onProfilePress?: () => void;
  rightElement?: React.ReactNode;
}

export default function Header({ 
  title, 
  subtitle, 
  showProfile = false,
  profileImage,
  onProfilePress,
  rightElement
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {showProfile && (
        <TouchableOpacity style={styles.profileContainer} onPress={onProfilePress}>
          <Image 
            source={{ uri: profileImage || 'https://picsum.photos/50/50' }} 
            style={styles.profileImage} 
          />
          <View style={styles.loginIcon}>
            <View style={styles.loginIconBg}>
              <Ionicons name="log-in-outline" size={16} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      )}
      
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
  },
  leftContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 2,
  },
  profileContainer: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FAF0CA',
  },
  loginIcon: {
    position: 'absolute',
    left: 32,
    top: 22,
  },
  loginIconBg: {
    width: 28,
    height: 28,
    backgroundColor: '#EE964B',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
}); 