export interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  fechaCreacion: string;
}

export interface Tarea {
  id: number;
  materiaId: number;
  titulo: string;
  descripcion: string;
  tipo: 'Tarea' | 'Examen' | 'Proyecto' | 'Quiz';
  fechaCreacion: string;
  fechaVencimiento: string;
  puntajeMaximo: number;
}

export interface Nota {
  id: number;
  tareaId: number;
  estudianteId: number;
  nombreEstudiante: string;
  puntaje: number;
  fechaEntrega: string;
  comentarios?: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaRegistro: string;
}

export interface EstadisticasMateria {
  materiaId: number;
  nombreMateria: string;
  promedio: number;
  notaMaxima: number;
  notaMinima: number;
  totalTareas: number;
  totalEstudiantes: number;
}
