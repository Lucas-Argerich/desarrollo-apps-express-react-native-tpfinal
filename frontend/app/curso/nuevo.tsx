import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import CustomScreenView from '../../components/CustomScreenView'
import { Ionicons } from '@expo/vector-icons'
import Select from '@/components/ui/Select'
import FileSelect from '@/components/ui/FileSelect'
import DateSelect from '@/components/ui/DateSelect'
import { router } from 'expo-router'
import { api } from '@/services/api'
import { CourseCreateInput } from '@/utils/types'

export default function NuevoCursoScreen() {
  const [curso, setCurso] = useState<CourseCreateInput>({
    titulo: '',
    descripcion: '',
    modalidad: '',
    duracion: undefined,
    precio: undefined,
    modulos: [{ titulo: '', video: '', contenido: '', orden: 1 }]
    // dificultad, contenidos, requerimientos can be added if needed
  })
  const [imagen, setImagen] = useState<string>()
  // Dynamic arrays (not in CourseCreateInput, but used for UI)
  const [cursadas, setCursadas] = useState([
    {
      fechaInicio: '',
      fechaFin: '',
      horario: '',
      duracion: '',
      ubicacion: '',
      cupos: ''
    }
  ])
  const [ingredientes, setIngredientes] = useState([{ nombre: '', medida: '', cantidad: '' }])
  const [utencilios, setUtencilios] = useState([{ nombre: '', proveido: false, cantidad: '' }])
  const [isUploading, setIsUploading] = useState(false)

  // Add/Remove handlers
  const addCursada = () =>
    setCursadas([
      ...cursadas,
      {
        fechaInicio: '',
        fechaFin: '',
        horario: '',
        duracion: '',
        ubicacion: '',
        cupos: ''
      }
    ])
  const removeCursada = (idx: number) => setCursadas(cursadas.filter((_, i) => i !== idx))
  const updateCursada = (idx: number, field: string, value: string) =>
    setCursadas(cursadas.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))

  const addIngrediente = () =>
    setIngredientes([...ingredientes, { nombre: '', medida: '', cantidad: '' }])
  const removeIngrediente = (idx: number) =>
    setIngredientes(ingredientes.filter((_, i) => i !== idx))
  const updateIngrediente = (idx: number, field: string, value: string) =>
    setIngredientes(ingredientes.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))

  const addUtencilio = () =>
    setUtencilios([...utencilios, { nombre: '', proveido: false, cantidad: '' }])
  const removeUtencilio = (idx: number) => setUtencilios(utencilios.filter((_, i) => i !== idx))
  const updateUtencilio = (idx: number, field: string, value: string | boolean) =>
    setUtencilios(utencilios.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))

  const addModulo = () =>
    setCurso((c) => ({
      ...c,
      modulos: [...(c.modulos || []), { titulo: '', video: '', contenido: '', orden: 1 }]
    }))
  const removeModulo = (idx: number) =>
    setCurso((c) => ({ ...c, modulos: (c.modulos || []).filter((_, i) => i !== idx) }))
  const updateModulo = (idx: number, field: string, value: string) =>
    setCurso((c) => ({
      ...c,
      modulos: (c.modulos || []).map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    }))

  const handleCerrar = () => {
    setCurso({
      titulo: '',
      descripcion: '',
      modalidad: '',
      duracion: undefined,
      precio: undefined,
      modulos: [{ titulo: '', video: '', contenido: '', orden: 1 }]
    })
    setImagen(undefined)
    setCursadas([
      {
        fechaInicio: '',
        fechaFin: '',
        horario: '',
        duracion: '',
        ubicacion: '',
        cupos: ''
      }
    ])
    setIngredientes([{ nombre: '', medida: '', cantidad: '' }])
    setUtencilios([{ nombre: '', proveido: false, cantidad: '' }])
    router.back()
  }

  const handleGuardar = () => {
    if (isUploading) return
    setIsUploading(true)
    try {
      let files = undefined
      const modulos = (curso.modulos || []).map((m, i) => ({
        titulo: m.titulo,
        orden: i + 1,
        contenido: m.contenido,
        video: m.video
      }))

      let dataToSend: CourseCreateInput = {
        ...curso,
        duracion: curso.duracion ? Number(curso.duracion) : undefined,
        precio: curso.precio ? Number(curso.precio) : undefined,
        modulos,
        ingredientes: ingredientes.map(i => ({
          nombre: i.nombre,
          cantidad: i.cantidad ? Number(i.cantidad) : undefined,
          unidad: i.medida
        })),
        utencilios: utencilios.map(u => ({
          nombre: u.nombre,
          cantidad: u.cantidad ? Number(u.cantidad) : undefined,
          descripcion: u.proveido ? 'proveido' : undefined
        })),
        cronograma: cursadas.map((c) => ({ 
          fechaInicio: c.fechaInicio,
          fechaFin: c.fechaFin,
          vacantesDisponibles: parseInt(c.cupos),
          ubicacion: c.ubicacion
        }))
      }
      if (
        imagen &&
        (imagen.startsWith('file:') ||
          imagen.startsWith('data:') ||
          imagen.match(/\.(jpg|jpeg|png|webp)$/i))
      ) {
        files = {
          imagen: {
            uri: imagen,
            name: 'portada.jpg',
            type: 'image/jpeg'
          }
        }
      }
      api('/courses', 'POST', {
        data: dataToSend,
        files
      })
        .then((res) => res.json()).then(() => router.back())
        .catch((e) => {
          throw e
        })
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al crear el curso.')
      console.log(e)
    } finally {
      setIsUploading(false)
    }
  }

  const modalidadOptions = ['Presencial', 'Virtual', 'Híbrido']
  const dificultadOptions = ['Fácil', 'Intermedio', 'Avanzado']

  return (
    <CustomScreenView style={{ paddingHorizontal: 16 }}>
      <View style={styles.topBar} />
      <View style={styles.headerBlock}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Nuevo Curso</Text>
          <TouchableOpacity
            onPress={handleCerrar}
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#2F2F2F" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Brinda toda la informacion necesaria de tu curso</Text>
      </View>

      {/* Nombre del curso */}
      <View style={styles.inputBlock}>
        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>Nombre del curso</Text>
        </View>
        <View style={styles.inputFieldRow}>
          <TextInput
            style={styles.inputField}
            placeholder="Nombre del curso"
            placeholderTextColor="#A5A5A5"
            value={curso.titulo}
            onChangeText={(v) => setCurso((c) => ({ ...c, titulo: v }))}
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
            value={curso.descripcion}
            onChangeText={(v) => setCurso((c) => ({ ...c, descripcion: v }))}
            multiline
          />
        </View>
      </View>

      {/* Modalidad y Dificultad */}
      <View style={styles.row2Col}>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Modalidad</Text>
          </View>
          <Select
            value={curso.modalidad}
            options={modalidadOptions}
            onSelect={(v) => setCurso((c) => ({ ...c, modalidad: v }))}
            placeholder="Modalidad"
          />
        </View>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Dificultad</Text>
          </View>
          <Select
            value={curso.dificultad || ''}
            options={dificultadOptions}
            onSelect={(v) => setCurso((c) => ({ ...c, dificultad: v }))}
            placeholder="Dificultad"
          />
        </View>
      </View>

      {/* Imagen de Portada */}
      <View style={styles.inputBlock}>
        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>Imagen de Portada</Text>
        </View>
        <FileSelect
          value={imagen || ''}
          onChange={(v) => setImagen(v)}
          options={{
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 0.7
          }}
        />
      </View>

      {/* Tiempo (Duración) */}
      <View style={styles.row2Col}>
        <View style={styles.inputBlockCol}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Tiempo (min/semana)</Text>
          </View>
          <View style={styles.inputFieldRowDropdown}>
            <TextInput
              style={styles.inputField}
              placeholder="Minutos"
              placeholderTextColor="#A5A5A5"
              value={curso.duracion?.toString() ?? ''}
              onChangeText={(v) => setCurso((c) => ({ ...c, duracion: v ? Number(v) : undefined }))}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Precio del Curso */}
      <View style={styles.inputBlock}>
        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>Precio del Curso</Text>
        </View>
        <View style={styles.inputFieldRow}>
          <TextInput
            style={styles.inputField}
            placeholder="$0"
            value={curso.precio?.toString() ?? ''}
            onChangeText={(v) => setCurso((c) => ({ ...c, precio: v ? Number(v) : undefined }))}
            placeholderTextColor="#A5A5A5"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Cursadas dinámicas */}
      <Text style={styles.sectionTitle}>Información de Calendario</Text>
      {cursadas.map((c, idx) => (
        <View key={idx} style={styles.cursadaCardImproved}>
          <View style={styles.cursadaHeaderImproved}>
            <Text style={styles.cursadaTitleImproved}>Cursada {idx + 1}</Text>
            {cursadas.length > 1 && (
              <TouchableOpacity style={styles.cursadaRemoveBtn} onPress={() => removeCursada(idx)}>
                <Ionicons name="trash" size={20} color="#EE964B" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cursadaRow2ColImproved}>
            <View style={styles.cursadaColImproved}>
              <Text style={styles.cursadaLabelImproved}>Fecha de Inicio</Text>
              <DateSelect
                value={c.fechaInicio}
                onChange={(v) => updateCursada(idx, 'fechaInicio', v)}
                placeholder="Fecha de Inicio"
              />
            </View>
            <View style={styles.cursadaColImproved}>
              <Text style={styles.cursadaLabelImproved}>Fecha de Fin</Text>
              <DateSelect
                value={c.fechaFin}
                onChange={(v) => updateCursada(idx, 'fechaFin', v)}
                placeholder="Fecha de Fin"
              />
            </View>
          </View>
          <View style={styles.cursadaRow2ColImproved}>
            <View style={styles.cursadaColImproved}>
              <Text style={styles.cursadaLabelImproved}>Horario</Text>
              <TextInput
                style={styles.cursadaInputImproved}
                placeholder="Ej: 18:00 - 20:00"
                value={c.horario}
                onChangeText={(v) => updateCursada(idx, 'horario', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
            <View style={styles.cursadaColImproved}>
              <Text style={styles.cursadaLabelImproved}>Duración</Text>
              <TextInput
                style={styles.cursadaInputImproved}
                placeholder="Ej: 2 Meses"
                value={c.duracion}
                onChangeText={(v) => updateCursada(idx, 'duracion', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
          </View>
          <View style={styles.cursadaRow2ColImproved}>
            <View style={styles.cursadaColImproved}>
              <Text style={styles.cursadaLabelImproved}>Ubicación/Link</Text>
              <TextInput
                style={styles.cursadaInputImproved}
                placeholder="Ubicación o link de la clase"
                value={c.ubicacion}
                onChangeText={(v) => updateCursada(idx, 'ubicacion', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
            <View style={styles.cursadaColImproved}>
              <Text style={styles.cursadaLabelImproved}>Cupos Disponibles</Text>
              <TextInput
                style={styles.cursadaInputImproved}
                placeholder="Ej: 20"
                value={c.cupos}
                onChangeText={(v) => updateCursada(idx, 'cupos', v)}
                placeholderTextColor="#A5A5A5"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addCursadaButtonImproved} onPress={addCursada}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Cursada</Text>
      </TouchableOpacity>

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
              <Text style={styles.ingredienteLabelImproved}>Medida</Text>
              <TextInput
                style={styles.ingredienteInputImproved}
                placeholder="Medida"
                value={c.medida}
                onChangeText={(v) => updateIngrediente(idx, 'medida', v)}
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
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addIngredienteButtonImproved} onPress={addIngrediente}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Ingrediente</Text>
      </TouchableOpacity>

      {/* Utencilios dinámicos */}
      <Text style={styles.sectionTitle}>Utensilios Recomendados</Text>
      {utencilios.map((c, idx) => (
        <View key={idx} style={styles.utencilioCardImproved}>
          <View style={styles.utencilioHeaderImproved}>
            <Text style={styles.utencilioTitleImproved}>Utensilio {idx + 1}</Text>
            {utencilios.length > 1 && (
              <TouchableOpacity
                style={styles.utencilioRemoveBtn}
                onPress={() => removeUtencilio(idx)}
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
                onChangeText={(v) => updateUtencilio(idx, 'nombre', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
            <View style={styles.utencilioColImproved}>
              <Text style={styles.utencilioLabelImproved}>Cantidad</Text>
              <TextInput
                style={styles.utencilioInputImproved}
                placeholder="Cantidad"
                value={c.cantidad}
                onChangeText={(v) => updateUtencilio(idx, 'cantidad', v)}
                placeholderTextColor="#A5A5A5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.utencilioColImproved}>
              <Text style={styles.utencilioLabelImproved}>Proveído</Text>
              <TouchableOpacity
                style={styles.utencilioCheckboxImproved}
                onPress={() => updateUtencilio(idx, 'proveido', !c.proveido)}
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
      <TouchableOpacity style={styles.addUtencilioButtonImproved} onPress={addUtencilio}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Utensilio</Text>
      </TouchableOpacity>

      {/* Modulos dinámicos */}
      <Text style={styles.sectionTitle}>Contenidos del Curso</Text>
      {(curso.modulos || []).map((c, idx) => (
        <View key={idx} style={styles.moduloCardImproved}>
          <View style={styles.moduloHeaderImproved}>
            <Text style={styles.moduloTitleImproved}>Módulo {idx + 1}</Text>
            {(curso.modulos || []).length > 1 && (
              <TouchableOpacity style={styles.moduloRemoveBtn} onPress={() => removeModulo(idx)}>
                <Ionicons name="trash" size={20} color="#EE964B" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.moduloRowImproved}>
            <View style={styles.moduloColImproved}>
              <Text style={styles.moduloLabelImproved}>Título</Text>
              <TextInput
                style={styles.moduloInputImproved}
                placeholder="Título"
                value={c.titulo}
                onChangeText={(v) => updateModulo(idx, 'titulo', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
            <View style={styles.moduloColImproved}>
              <Text style={styles.moduloLabelImproved}>Video URL</Text>
              <TextInput
                style={styles.moduloInputImproved}
                placeholder="Video URL"
                value={c.video}
                onChangeText={(v) => updateModulo(idx, 'video', v)}
                placeholderTextColor="#A5A5A5"
              />
            </View>
          </View>
          <View style={styles.moduloRowImproved}>
            <View style={styles.moduloColImproved}>
              <Text style={styles.moduloLabelImproved}>Contenido</Text>
              <TextInput
                style={[styles.moduloInputImproved, { minHeight: 60 }]}
                placeholder="Contenido"
                value={c.contenido}
                onChangeText={(v) => updateModulo(idx, 'contenido', v)}
                placeholderTextColor="#A5A5A5"
                multiline
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addModuloButtonImproved} onPress={addModulo}>
        <Ionicons name="add-circle-outline" size={24} color="#EE964B" />
        <Text style={styles.addText}>Agregar Módulo</Text>
      </TouchableOpacity>

      {/* Guardar/Cancelar */}
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.cancelButton} disabled={isUploading} onPress={handleCerrar}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} disabled={isUploading} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </CustomScreenView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    backgroundColor: '#FFF',
    borderRadius: 50,
    flexGrow: 1
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
  inputFieldRowDropdownLarge: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    padding: 20
  },
  inputFieldDropdownText: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16
  },
  inputFieldRowImage: {
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
  rowIngredient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12
  },
  ingredientCard: {
    width: 113,
    height: 174,
    backgroundColor: 'rgba(238,150,75,0.6)',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 0
  },
  ingredientImagePlaceholder: {
    width: 113,
    height: 93,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  ingredientInfo: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 8,
    gap: 2
  },
  ingredientTitle: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 16
  },
  ingredientMeasure: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20
  },
  inputBlockLarge: {
    width: '100%',
    minHeight: 100,
    alignSelf: 'center',
    marginBottom: 12
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
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 8
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginTop: 2,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  dropdownItemText: {
    color: '#1B1B1B',
    fontSize: 16
  },
  cursadaCardImproved: {
    width: '100%',
    backgroundColor: '#F9F7F4',
    borderRadius: 16,
    marginBottom: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E6DD'
  },
  cursadaHeaderImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  cursadaTitleImproved: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 17
  },
  cursadaRemoveBtn: {
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    padding: 4
  },
  cursadaRow2ColImproved: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8
  },
  cursadaColImproved: {
    flex: 1
  },
  cursadaLabelImproved: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 2,
    fontSize: 14
  },
  cursadaInputImproved: {
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
  addCursadaButtonImproved: {
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
  moduloCardImproved: {
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
  moduloHeaderImproved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  moduloTitleImproved: {
    color: '#1B1B1B',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16
  },
  moduloRemoveBtn: {
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    padding: 4
  },
  moduloRowImproved: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4
  },
  moduloColImproved: {
    flex: 1
  },
  moduloLabelImproved: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 2,
    fontSize: 14
  },
  moduloInputImproved: {
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
  addModuloButtonImproved: {
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
  }
})
