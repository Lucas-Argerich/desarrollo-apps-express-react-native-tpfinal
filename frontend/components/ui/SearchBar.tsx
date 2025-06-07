import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

export default function SearchBar({
  placeholder = "Buscar recetas, cursos, ingredientes...",
  value,
  onChangeText,
  onFilterPress,
  showFilter = true,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888888"
        value={value}
        onChangeText={onChangeText}
      />
      {showFilter && (
        <TouchableOpacity onPress={onFilterPress}>
          <Ionicons name="options-outline" size={22} color="#B0B0B0" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D2D2D2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2F2F2F',
  },
}); 