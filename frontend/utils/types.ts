export interface Unidad {
  idUnidad: number;
  descripcion: string;
}

export interface Ingrediente {
  idIngrediente: number;
  nombre: string;
}

export interface Utencilio {
  idUtencilio: number;
  nombre: string;
}

export interface Utilizado {
  idUtilizado: number;
  idReceta: number;
  idIngrediente: number | null;
  idUtencilio: number | null;
  cantidad: number;
  idUnidad: number;
  observaciones: string | null;
  ingrediente: Ingrediente | null;
  utencilio: Utencilio | null;
  unidad: Unidad;
}

export interface Paso {
  idPaso: number;
  idReceta: number;
  nroPaso: number;
  texto: string;
}

export interface Calificacion {
  // Define fields if needed, left empty as per example
}

export interface Receta {
  idReceta: number;
  idUsuario: number;
  nombreReceta: string;
  descripcionReceta: string;
  fotoPrincipal: string;
  porciones: number;
  cantidadPersonas: number;
  idTipo: number;
  utilizados: Utilizado[];
  pasos: Paso[];
  calificaciones: Calificacion[];
  usuario: {
    nombre: string;
    nickname: string;
    mail: string;
  }
}