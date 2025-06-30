import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import CustomScreenView from '../../components/CustomScreenView'
import Header from '@/components/ui/Header'
import Button from '@/components/ui/Button'

export default function NuevaRecetaScreen() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const handleSubmit = () => {
    Alert.alert('Receta creada', `Nombre: ${nombre}\nDescripción: ${descripcion}`)
  }

  return (
    <CustomScreenView>
      <Header title="Crear Receta" subtitle="Completa los datos para tu nueva receta" />
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre de la receta"
        />
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción de la receta"
          multiline
        />
        <Button onPress={handleSubmit} style={{ marginTop: 24 }}>
          Crear Receta
        </Button>
      </View>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  form: {
    margin: 24,
    gap: 16
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 8
  }
})
