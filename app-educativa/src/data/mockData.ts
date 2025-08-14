import { Materia, Tarea, Nota, Estudiante } from '@/types';

// Datos de ejemplo para la app
export const materiasIniciales: Materia[] = [
  {
    id: 1,
    nombre: 'Matemáticas',
    descripcion: 'Curso de matemáticas básicas y avanzadas',
    color: 'bg-blue-500',
    fechaCreacion: '2025-01-01'
  },
  {
    id: 2,
    nombre: 'Ciencias',
    descripcion: 'Física, química y biología',
    color: 'bg-green-500',
    fechaCreacion: '2025-01-02'
  },
  {
    id: 3,
    nombre: 'Historia',
    descripcion: 'Historia universal y nacional',
    color: 'bg-yellow-500',
    fechaCreacion: '2025-01-03'
  },
  {
    id: 4,
    nombre: 'Literatura',
    descripcion: 'Análisis de textos y escritura creativa',
    color: 'bg-purple-500',
    fechaCreacion: '2025-01-04'
  }
];

export const estudiantesIniciales: Estudiante[] = [
  {
    id: 1,
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana.garcia@email.com',
    fechaRegistro: '2025-01-01'
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@email.com',
    fechaRegistro: '2025-01-02'
  },
  {
    id: 3,
    nombre: 'María',
    apellido: 'Rodríguez',
    email: 'maria.rodriguez@email.com',
    fechaRegistro: '2025-01-03'
  },
  {
    id: 4,
    nombre: 'Luis',
    apellido: 'Martínez',
    email: 'luis.martinez@email.com',
    fechaRegistro: '2025-01-04'
  }
];

export const tareasIniciales: Tarea[] = [
  {
    id: 1,
    materiaId: 1,
    titulo: 'Examen de Álgebra',
    descripcion: 'Evaluación de conceptos básicos de álgebra',
    tipo: 'Examen',
    fechaCreacion: '2025-01-05',
    fechaVencimiento: '2025-01-20',
    puntajeMaximo: 100
  },
  {
    id: 2,
    materiaId: 1,
    titulo: 'Tarea de Geometría',
    descripcion: 'Ejercicios de geometría plana',
    tipo: 'Tarea',
    fechaCreacion: '2025-01-10',
    fechaVencimiento: '2025-01-25',
    puntajeMaximo: 50
  },
  {
    id: 3,
    materiaId: 2,
    titulo: 'Laboratorio de Química',
    descripcion: 'Práctica de reacciones químicas',
    tipo: 'Proyecto',
    fechaCreacion: '2025-01-08',
    fechaVencimiento: '2025-01-30',
    puntajeMaximo: 80
  },
  {
    id: 4,
    materiaId: 3,
    titulo: 'Quiz de Historia Antigua',
    descripcion: 'Evaluación rápida sobre civilizaciones antiguas',
    tipo: 'Quiz',
    fechaCreacion: '2025-01-12',
    fechaVencimiento: '2025-01-18',
    puntajeMaximo: 25
  }
];

export const notasIniciales: Nota[] = [
  // Notas para Examen de Álgebra (tarea id: 1)
  {
    id: 1,
    tareaId: 1,
    estudianteId: 1,
    nombreEstudiante: 'Ana García',
    puntaje: 85,
    fechaEntrega: '2025-01-19',
    comentarios: 'Buen dominio de los conceptos básicos'
  },
  {
    id: 2,
    tareaId: 1,
    estudianteId: 2,
    nombreEstudiante: 'Carlos López',
    puntaje: 92,
    fechaEntrega: '2025-01-19',
    comentarios: 'Excelente trabajo'
  },
  {
    id: 3,
    tareaId: 1,
    estudianteId: 3,
    nombreEstudiante: 'María Rodríguez',
    puntaje: 78,
    fechaEntrega: '2025-01-20',
    comentarios: 'Necesita repasar algunos temas'
  },
  {
    id: 4,
    tareaId: 1,
    estudianteId: 4,
    nombreEstudiante: 'Luis Martínez',
    puntaje: 88,
    fechaEntrega: '2025-01-19',
    comentarios: 'Muy buen desempeño'
  },
  // Notas para Tarea de Geometría (tarea id: 2)
  {
    id: 5,
    tareaId: 2,
    estudianteId: 1,
    nombreEstudiante: 'Ana García',
    puntaje: 45,
    fechaEntrega: '2025-01-24',
    comentarios: 'Excelente presentación'
  },
  {
    id: 6,
    tareaId: 2,
    estudianteId: 2,
    nombreEstudiante: 'Carlos López',
    puntaje: 42,
    fechaEntrega: '2025-01-25',
    comentarios: 'Buena resolución de problemas'
  },
  // Notas para Laboratorio de Química (tarea id: 3)
  {
    id: 7,
    tareaId: 3,
    estudianteId: 3,
    nombreEstudiante: 'María Rodríguez',
    puntaje: 75,
    fechaEntrega: '2025-01-29',
    comentarios: 'Buen trabajo experimental'
  },
  {
    id: 8,
    tareaId: 3,
    estudianteId: 4,
    nombreEstudiante: 'Luis Martínez',
    puntaje: 72,
    fechaEntrega: '2025-01-30',
    comentarios: 'Necesita mejorar el reporte'
  },
  // Notas para Quiz de Historia (tarea id: 4)
  {
    id: 9,
    tareaId: 4,
    estudianteId: 1,
    nombreEstudiante: 'Ana García',
    puntaje: 23,
    fechaEntrega: '2025-01-18',
    comentarios: 'Excelente conocimiento histórico'
  },
  {
    id: 10,
    tareaId: 4,
    estudianteId: 2,
    nombreEstudiante: 'Carlos López',
    puntaje: 20,
    fechaEntrega: '2025-01-18',
    comentarios: 'Buen esfuerzo'
  }
];
