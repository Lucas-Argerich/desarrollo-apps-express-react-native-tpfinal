export interface Unidad {
  idUnidad: number
  descripcion: string
}

export interface Ingrediente {
  idIngrediente: number
  nombre: string
}

export interface Utencilio {
  idUtencilio: number
  nombre: string
}

export interface Utilizado {
  idUtilizado: number
  idReceta: number
  idIngrediente: number | null
  idUtencilio: number | null
  cantidad: number
  idUnidad: number
  observaciones: string | null
  ingrediente: Ingrediente | null
  utencilio: Utencilio | null
  unidad: Unidad
}

export interface Multimedia {
  idContenido: number
  idPaso: number
  tipo_contenido: string
  extension: string | null
  urlContenido: string | null
}

export interface Paso {
  idPaso: number
  idReceta: number
  nroPaso: number
  texto: string
  multimedia: Multimedia[]
}

export interface Calificacion {
  calificacion: string
  comentario: string | null
  usuario: { idUsuario: number; nombre: string; nickname: string } | null
}

export interface IngredienteUtilizado {
  idUtilizado: number
  nombre: string
  cantidad: number
  unidad: string
  observaciones: string | null
}

export interface UtencilioUtilizado {
  idUtilizado: number
  nombre: string
  cantidad: number
  unidad: string
  observaciones: string | null
}

export interface Receta {
  idReceta: number
  nombreReceta: string
  descripcionReceta: string
  fotoPrincipal: string
  porciones: number
  cantidadPersonas: number
  idTipo: number
  ingredientes: IngredienteUtilizado[]
  utencilios: UtencilioUtilizado[]
  pasos: Paso[]
  calificaciones: Calificacion[]
  calificacion: number
  usuario: {
    nombre: string
    nickname: string
    mail: string
  }
  tipo: {
    descripcion: string
  }
}

export interface Curso {
  idCurso: number
  descripcion: string | null
  contenidos: string | null
  requerimientos: string | null
  duracion: number | null
  precio: number | null
  modalidad: string
  titulo: string | null
  dificultad: string | null
  imagen: string | null
  alumnos?: number
  calificacion?: number
  modulos?: Modulo[]
}

export interface Modulo {
  idModulo: number
  titulo: string
  orden: number
  contenido?: string | null
  duracion?: number | null
  video?: string | null
}
