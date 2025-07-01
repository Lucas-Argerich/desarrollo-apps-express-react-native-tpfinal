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

export interface Usuario {
  idUsuario: number
  nombre: string
  nickname: string
  mail: string
  direccion: string | null
  avatar: string | null
  password?: string // Optional for update operations
}

export interface Asistencia {
  idAsistencia: number
  alumno: Usuario
}

export interface Cronograma {
  idCronograma: number
  idSede: number
  idCurso: number
  fechaInicio: string | null
  fechaFin: string | null
  vacantesDisponibles: number | null
  sede?: {
    idSede: number
    nombreSede: string
    direccionSede: string
    telefonoSede: string | null
    mailSede: string | null
    whatsApp: string | null
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
  cronogramas?: Cronograma[]
  autor?: Usuario
  ingredientes?: Ingrediente[]
  utencilios?: Utencilio[]
}

export interface Modulo {
  idModulo: number
  titulo: string
  orden: number
  contenido?: string | null
  duracion?: number | null
  video?: string | null
}

// Course types
export interface CourseCreateInput {
  descripcion?: string;
  contenidos?: string;
  requerimientos?: string;
  duracion?: number;
  precio?: number;
  modalidad: string;
  titulo?: string;
  dificultad?: string;
  modulos?: ModuleCreateInput[];
  cronograma?: {
    fechaInicio?: string;
    fechaFin?: string;
    vacantesDisponibles?: number;
    ubicacion?: string
  }[];
  ingredientes?: { nombre: string; cantidad?: number; unidad?: string }[];
  utencilios?: { nombre: string; cantidad?: number; descripcion?: string }[];
}

export interface ModuleCreateInput {
  titulo: string;
  orden: number;
  contenido?: string;
  duracion?: number;
  video?: string;
}
