import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import FileSelect from '@/components/ui/FileSelect'
import Select from '@/components/ui/Select'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { api } from '@/services/api'
import CustomScreenView from '@/components/CustomScreenView'

const categoriaOptions = [
  'Panadería',
  'Pastelería',
  'Cocina',
  'Bebidas',
  'Carnes',
  'Vegetariana',
  'Vegana',
  'Sin TACC',
  'Internacional',
  'Regional',
  'Sushi',
  'Parrilla',
  'Repostería',
  'Café',
  'Vinos',
  'Coctelería'
]
const dificultadOptions = ['Fácil', 'Intermedio', 'Avanzado']

export default function EditarRecetaScreen() {
  const { recetaId: id } = useLocalSearchParams()
  const [nombreReceta, setNombreReceta] = useState('')
  const [descripcionReceta, setDescripcionReceta] = useState('')
  const [fotoPrincipal, setFotoPrincipal] = useState<string>()
  const [porciones, setPorciones] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dificultad, setDificultad] = useState('')
  const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '', unidad: '' }])
  const [utensilios, setUtensilios] = useState([{ nombre: '', proveido: false }])
  const [pasos, setPasos] = useState([{ texto: '', nroPaso: 1 }])
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load recipe data
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeId = Array.isArray(id) ? id[0] : id
        const response = await api('/recipes/:id', 'GET', { params: { id: recipeId } })
        const recipe = await response.json()
        
        setNombreReceta(recipe.nombreReceta || '')
        setDescripcionReceta(recipe.descripcionReceta || '')
        setFotoPrincipal(recipe.fotoPrincipal || '')
        setPorciones(recipe.porciones?.toString() || '')
        setTiempo(recipe.tiempo?.toString() || '')
        setCategoria(recipe.categoria || '')
        setDificultad(recipe.dificultad || '')
        
        // Set ingredients
        if (recipe.ingredientes && recipe.ingredientes.length > 0) {
          setIngredientes(recipe.ingredientes.map((ing: any) => ({
            nombre: ing.nombre || '',
            cantidad: ing.cantidad?.toString() || '',
            unidad: ing.unidad || ''
          })))
        }
        
        // Set utensils
        if (recipe.utencilios && recipe.utencilios.length > 0) {
          setUtensilios(recipe.utencilios.map((ut: any) => ({
            nombre: ut.nombre || '',
            proveido: ut.proveido || false
          })))
        }
        
        // Set steps
        if (recipe.pasos && recipe.pasos.length > 0) {
          setPasos(recipe.pasos.map((paso: any) => ({
            texto: paso.texto || '',
            nroPaso: paso.nroPaso || 1
          })))
        }
      } catch (error) {
        console.error('Error loading recipe:', error)
        Alert.alert('Error', 'No se pudo cargar la receta')
        router.back()
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadRecipe()
    }
  }, [id])

  // Handlers dinámicos
  const addIngrediente = () =>
    setIngredientes([...ingredientes, { nombre: '', cantidad: '', unidad: '' }])
  const removeIngrediente = (idx: number) =>
    setIngredientes(ingredientes.filter((_, i) => i !== idx))
  const updateIngrediente = (idx: number, field: string, value: string) =>
    setIngredientes(ingredientes.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))

  const addUtensilio = () => setUtensilios([...utensilios, { nombre: '', proveido: false }])
  const removeUtensilio = (idx: number) => setUtensilios(utensilios.filter((_, i) => i !== idx))
  const updateUtensilio = (idx: number, field: string, value: string | boolean) =>
    setUtensilios(utensilios.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))

  const addPaso = () => setPasos([...pasos, { texto: '', nroPaso: pasos.length + 1 }])
  const removePaso = (idx: number) => setPasos(pasos.filter((_, i) => i !== idx))
  const updatePaso = (idx: number, value: string) =>
    setPasos(pasos.map((p, i) => (i === idx ? { ...p, texto: value } : p)))

  const handleCerrar = () => {
    router.back()
  }

  const handleGuardar = () => {
    if (isUploading) return
    setIsUploading(true)
    try {
      const recipeId = Array.isArray(id) ? id[0] : id
      let files = undefined
      if (
        fotoPrincipal &&
        (fotoPrincipal.startsWith('file:') ||
          fotoPrincipal.startsWith('data:') ||
          fotoPrincipal.match(/\.(jpg|jpeg|png|webp)$/i))
      ) {
        files = {
          fotoPrincipal: {
            uri: fotoPrincipal,
            name: 'foto.jpg',
            type: 'image/jpeg'
          }
        }
      }

      const dataToSend = {
        nombreReceta,
        descripcionReceta,
        fotoPrincipal: files ? undefined : fotoPrincipal,
        porciones: porciones ? Number(porciones) : undefined,
        ingredientes: ingredientes.map((i) => ({
          nombre: i.nombre,
          cantidad: i.cantidad ? Number(i.cantidad) : undefined,
          unidad: i.unidad
        })),
        utencilios: utensilios.map((i) => ({
          nombre: i.nombre
        })),
        pasos: pasos.map((p, idx) => ({
          texto: p.texto,
          nroPaso: idx + 1
        }))
      }

      api('/recipes/:id', 'PUT', {
        params: { id: recipeId },
        data: dataToSend,
        files
      }).then(() => {
        Alert.alert('Éxito', 'Receta actualizada correctamente')
        router.back()
      }).catch((e) => { throw e })
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al actualizar la receta.')
      console.log(e)
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <CustomScreenView style={{ paddingHorizontal: 16 }}>
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </View>
      </CustomScreenView>
    )
  }

  return (
    <CustomScreenView style={{ paddingHorizontal: 16 }}>
      <View style={styles.topBar} />
      <View style={styles.headerBlock}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Editar Receta</Text>
          <TouchableOpacity
            onPress={handleCerrar}
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#2F2F2F" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Edita tu receta paso a paso</Text>
      </View>

      {/* Nombre de la receta */}
      <View style={styles.inputBlock}>
        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>Nombre de la receta</Text>
        </View>
        <View style={styles.inputFieldRow}>
          <TextInput
            style={styles.inputField}
            placeholder="Nombre de la receta"
            placeholderTextColor="#A5A5A5"
            value={nombreReceta}
            onChangeText={setNombreReceta}
          />
        </View>
      </View>

      {/* Descripción breve */}
      <View style={styles.inputBlock}>
        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>Descripción Breve</Text>
        </View>
        <View style={styles.inputFieldRow}>
          <TextInput
            style={styles.inputField}
            placeholder="Descripción"
            placeholderTextColor="#A5A5A5"
            value={descripcionReceta}
            onChangeText={setDescripcionReceta}
            multiline
          />
        </View>
      </View>

      {/* Categoria y Dificultad */}
      <View style={styles.row2Col}>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Categoria</Text>
          </View>
          <Select
            value={categoria}
            options={categoriaOptions}
            onSelect={setCategoria}
            placeholder="Categoria"
          />
        </View>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Dificultad</Text>
          </View>
          <Select
            value={dificultad}
            options={dificultadOptions}
            onSelect={setDificultad}
            placeholder="Dificultad"
          />
        </View>
      </View>

      {/* Imagen Destacada */}
      <View style={styles.inputBlock}>
        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>Imagen Destacada</Text>
        </View>
        <FileSelect
          value={fotoPrincipal || ''}
          onChange={setFotoPrincipal}
          options={{ mediaTypes: 'images', allowsEditing: true, quality: 0.7 }}
        />
      </View>

      {/* Tiempo y Porciones */}
      <View style={styles.row2Col}>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Tiempo</Text>
          </View>
          <View style={styles.inputFieldRowDropdown}>
            <TextInput
              style={styles.inputField}
              placeholder="Minutos"
              placeholderTextColor="#A5A5A5"
              value={tiempo}
              onChangeText={setTiempo}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Porciones</Text>
          </View>
          <View style={styles.inputFieldRowDropdown}>
            <TextInput
              style={styles.inputField}
              placeholder="Numero"
              placeholderTextColor="#A5A5A5"
              value={porciones}
              onChangeText={setPorciones}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Ingredientes dinámicos */}
      <Text style={styles.sectionTitle}>Ingredientes Necesarios</Text>
      {ingredientes.map((c, idx) => (
        <View key={idx} style={styles.ingredienteCardImproved}>
          <View style={styles.ingredienteHeaderImproved}>
            <Text style={styles.ingredienteTitleImproved}>Ingrediente {idx + 1}</Text>
            {ingredientes.length > 1 && (
              <TouchableOpacity
                style={styles.ingredienteRemoveBtn}
                onPress={() => removeIngrediente(idx)}
              >
                <Ionicons name="trash" size={20} color="#EE964B" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.ingredienteRowImproved}>
            <View style={styles.ingredienteColImproved}>
              <Text style={styles.ingredienteLabelImproved}>Nombre</Text>
              <TextInput
                style={styles.ingredienteInputImproved}
                placeholder="Ingrediente"
                value={c.nombre}
                onChangeText={(v) => updateIngrediente(idx, 'nombre', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
            <View style={styles.ingredienteColImproved}>
              <Text style={styles.ingredienteLabelImproved}>Cantidad</Text>
              <TextInput
                style={styles.ingredienteInputImproved}
                placeholder="Cantidad"
                value={c.cantidad}
                onChangeText={(v) => updateIngrediente(idx, 'cantidad', v)}
                placeholderTextColor="#A5A5A5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.ingredienteColImproved}>
              <Text style={styles.ingredienteLabelImproved}>Unidad</Text>
              <TextInput
                style={styles.ingredienteInputImproved}
                placeholder="Unidad"
                value={c.unidad}
                onChangeText={(v) => updateIngrediente(idx, 'unidad', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addIngredienteButtonImproved} onPress={addIngrediente}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Ingrediente</Text>
      </TouchableOpacity>

      {/* Utensilios dinámicos */}
      <Text style={styles.sectionTitle}>Utensilios Recomendados</Text>
      {utensilios.map((c, idx) => (
        <View key={idx} style={styles.utencilioCardImproved}>
          <View style={styles.utencilioHeaderImproved}>
            <Text style={styles.utencilioTitleImproved}>Utensilio {idx + 1}</Text>
            {utensilios.length > 1 && (
              <TouchableOpacity
                style={styles.utencilioRemoveBtn}
                onPress={() => removeUtensilio(idx)}
              >
                <Ionicons name="trash" size={20} color="#EE964B" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.utencilioRowImproved}>
            <View style={styles.utencilioColImproved}>
              <Text style={styles.utencilioLabelImproved}>Nombre</Text>
              <TextInput
                style={styles.utencilioInputImproved}
                placeholder="Utensilio"
                value={c.nombre}
                onChangeText={(v) => updateUtensilio(idx, 'nombre', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
            <View style={styles.utencilioColImproved}>
              <Text style={styles.utencilioLabelImproved}>Proveído</Text>
              <TouchableOpacity
                style={styles.utencilioCheckboxImproved}
                onPress={() => updateUtensilio(idx, 'proveido', !c.proveido)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: c.proveido }}
              >
                <Ionicons
                  name={c.proveido ? 'checkbox' : 'square-outline'}
                  size={22}
                  color="#EE964B"
                />
                <Text style={styles.utencilioCheckboxLabelImproved}>
                  {c.proveido ? 'Sí' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addUtencilioButtonImproved} onPress={addUtensilio}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Utensilio</Text>
      </TouchableOpacity>

      {/* Instrucciones paso a paso */}
      <Text style={styles.sectionTitle}>Instrucciones paso a paso</Text>
      {pasos.map((p, idx) => (
        <View key={idx} style={styles.inputBlock}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Paso {idx + 1}</Text>
            {pasos.length > 1 && (
              <TouchableOpacity onPress={() => removePaso(idx)}>
                <Ionicons name="trash" size={20} color="#EE964B" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputFieldRow}>
            <TextInput
              style={styles.inputField}
              placeholder="Descripción del paso"
              placeholderTextColor="#A5A5A5"
              value={p.texto}
              onChangeText={(v) => updatePaso(idx, v)}
              multiline
            />
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addPaso}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Paso</Text>
      </TouchableOpacity>

      {/* Guardar/Cancelar */}
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCerrar}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBar: {
    width: 100,
    height: 12,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    marginBottom: 12
  },
  headerBlock: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 24
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    marginBottom: 8
  },
  title: {
    color: '#2F2F2F',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'Montserrat'
  },
  subtitle: {
    color: '#888',
    fontFamily: 'Inter',
    fontWeight: '500',
    letterSpacing: 0.08,
    marginTop: 2
  },
  inputBlock: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12
  },
  inputBlockCol: {
    flex: 1,
    minWidth: 170,
    maxWidth: 200,
    marginBottom: 12
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 2
  },
  inputLabel: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center'
  },
  inputFieldRow: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    paddingHorizontal: 20
  },
  inputField: {
    flex: 1,
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16
  },
  inputFieldRowDropdown: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    paddingHorizontal: 20
  },
  row2Col: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    color: '#1B1B1B',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8
  },
  addText: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginVertical: 8
  },
  ingredienteCardImproved: {
    width: '100%',
    backgroundColor: '#F9F7F4',
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E6DD'
  },
  ingredienteHeaderImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  ingredienteTitleImproved: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16
  },
  ingredienteRemoveBtn: {
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    padding: 4
  },
  ingredienteRowImproved: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4
  },
  ingredienteColImproved: {
    flex: 1
  },
  ingredienteLabelImproved: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 2,
    fontSize: 14
  },
  ingredienteInputImproved: {
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginBottom: 2
  },
  addIngredienteButtonImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start'
  },
  utencilioCardImproved: {
    width: '100%',
    backgroundColor: '#F9F7F4',
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E6DD'
  },
  utencilioHeaderImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  utencilioTitleImproved: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16
  },
  utencilioRemoveBtn: {
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    padding: 4
  },
  utencilioRowImproved: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4
  },
  utencilioColImproved: {
    flex: 1,
    justifyContent: 'center'
  },
  utencilioLabelImproved: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 2,
    fontSize: 14
  },
  utencilioInputImproved: {
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginBottom: 2
  },
  utencilioCheckboxImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginTop: 2,
    marginBottom: 2,
    gap: 6
  },
  utencilioCheckboxLabelImproved: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 15,
    marginLeft: 2
  },
  addUtencilioButtonImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start'
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 32
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  cancelButtonText: {
    color: '#CAC8C8',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#EE964B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.15,
    shadowRadius: 19
  },
  saveButtonText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 18
  }
}) 