import { Nota, Materia, Tarea, EstadisticasMateria } from '@/types';

export const calcularPromedio = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  return Math.round((suma / notas.length) * 100) / 100;
};

export const calcularNotaMaxima = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  return Math.max(...notas);
};

export const calcularNotaMinima = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  return Math.min(...notas);
};

export const calcularMediana = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  const notasOrdenadas = [...notas].sort((a, b) => a - b);
  const mitad = Math.floor(notasOrdenadas.length / 2);
  
  if (notasOrdenadas.length % 2 === 0) {
    return (notasOrdenadas[mitad - 1] + notasOrdenadas[mitad]) / 2;
  }
  return notasOrdenadas[mitad];
};

export const calcularDesviacionEstandar = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  const promedio = calcularPromedio(notas);
  const sumatoriaCuadrados = notas.reduce((acc, nota) => acc + Math.pow(nota - promedio, 2), 0);
  return Math.round(Math.sqrt(sumatoriaCuadrados / notas.length) * 100) / 100;
};

export const calcularPorcentajeAprobados = (notas: number[], notaMinima: number = 60): number => {
  if (notas.length === 0) return 0;
  const aprobados = notas.filter(nota => nota >= notaMinima).length;
  return Math.round((aprobados / notas.length) * 100);
};

export const obtenerEstadisticasPorMateria = (
  materia: Materia,
  tareas: Tarea[],
  notas: Nota[]
): EstadisticasMateria => {
  const tareasMateria = tareas.filter(tarea => tarea.materiaId === materia.id);
  const idsTageasMateria = tareasMateria.map(tarea => tarea.id);
  const notasMateria = notas.filter(nota => idsTageasMateria.includes(nota.tareaId));
  
  const valoresNotas = notasMateria.map(nota => nota.puntaje);
  const estudiantesUnicos = [...new Set(notasMateria.map(nota => nota.estudianteId))];

  return {
    materiaId: materia.id,
    nombreMateria: materia.nombre,
    promedio: calcularPromedio(valoresNotas),
    notaMaxima: calcularNotaMaxima(valoresNotas),
    notaMinima: calcularNotaMinima(valoresNotas),
    totalTareas: tareasMateria.length,
    totalEstudiantes: estudiantesUnicos.length
  };
};

export const obtenerEstadisticasPorTarea = (
  tarea: Tarea,
  notas: Nota[]
) => {
  const notasTarea = notas.filter(nota => nota.tareaId === tarea.id);
  const valoresNotas = notasTarea.map(nota => nota.puntaje);
  
  return {
    tareaId: tarea.id,
    tituloTarea: tarea.titulo,
    promedio: calcularPromedio(valoresNotas),
    notaMaxima: calcularNotaMaxima(valoresNotas),
    notaMinima: calcularNotaMinima(valoresNotas),
    mediana: calcularMediana(valoresNotas),
    desviacionEstandar: calcularDesviacionEstandar(valoresNotas),
    porcentajeAprobados: calcularPorcentajeAprobados(valoresNotas),
    totalEstudiantes: notasTarea.length,
    puntajeMaximoPosible: tarea.puntajeMaximo
  };
};

export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatearFechaCorta = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const calcularPorcentaje = (valor: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
};
