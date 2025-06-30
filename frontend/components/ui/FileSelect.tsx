import React from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

export default function FileSelect({ value, onChange, options }: { value: string, onChange: (uri: string) => void, options?: ImagePicker.ImagePickerOptions }) {
  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(options)
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      onChange(result.assets[0].uri)
    }
  }
  return (
    <TouchableOpacity style={styles.inputFieldRowImage} onPress={handlePick} activeOpacity={0.8}>
      {value ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="image" size={24} color="#A5A5A5" style={{ marginRight: 8 }} />
          <Text style={styles.inputFieldDropdownText} numberOfLines={1} ellipsizeMode="middle">Imagen seleccionada</Text>
        </View>
      ) : (
        <>
          <Ionicons name="attach" size={24} color="#A5A5A5" style={{ marginRight: 8 }} />
          <Text style={styles.inputFieldDropdownText}>Archivo</Text>
        </>
      )}
      {value ? (
        <View style={{ marginLeft: 'auto' }}>
          <Image source={{ uri: value }} style={{ width: 36, height: 36, borderRadius: 8 }} />
        </View>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  inputFieldRowImage: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    paddingHorizontal: 20
  },
  inputFieldDropdownText: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16
  }
}) 