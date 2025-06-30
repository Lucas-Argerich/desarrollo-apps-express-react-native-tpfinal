import React from 'react';
import { View, TextInput, StyleSheet, ViewProps } from 'react-native';
interface SearchBarProps extends ViewProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchBar({
  placeholder = "Buscar recetas, cursos, ingredientes...",
  value,
  onChangeText,
  style,
  ...props
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888888"
        value={value}
        onChangeText={onChangeText}
      />
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
    paddingVertical: 2,
    color: '#2F2F2F',
  },
}); 