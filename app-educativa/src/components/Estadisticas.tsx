'use client';

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Materia, Tarea, Nota, Estudiante } from '@/types';
import { 
  calcularPromedio, 
  calcularNotaMaxima, 
  calcularNotaMinima,
  calcularPorcentajeAprobados,
  obtenerEstadisticasPorMateria 
} from '@/utils/calculations';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

interface EstadisticasProps {
  materias: Materia[];
  tareas: Tarea[];
  notas: Nota[];
  estudiantes: Estudiante[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Estadisticas({ materias, tareas, notas, estudiantes }: EstadisticasProps) {
  const estadisticas = useMemo(() => {
    // Estadísticas generales
    const totalMaterias = materias.length;
    const totalTareas = tareas.length;
    const totalNotas = notas.length;
    const totalEstudiantes = estudiantes.length;

    // Promedio general
    const promedioGeneral = calcularPromedio(notas.map(n => n.puntaje));

    // Estadísticas por materia
    const estadisticasPorMateria = materias.map(materia => 
      obtenerEstadisticasPorMateria(materia, tareas, notas)
    );

    // Datos para gráfico de barras - Promedio por materia
    const datosBarras = estadisticasPorMateria.map(est => ({
      nombre: est.nombreMateria,
      promedio: est.promedio,
      notaMaxima: est.notaMaxima,
      notaMinima: est.notaMinima
    }));

    // Datos para gráfico circular - Distribución de tipos de tareas
    const tiposTareas = tareas.reduce((acc, tarea) => {
      acc[tarea.tipo] = (acc[tarea.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const datosCircular = Object.entries(tiposTareas).map(([tipo, cantidad]) => ({
      name: tipo,
      value: cantidad
    }));

    // Datos para gráfico de líneas - Tendencia de notas por fecha
    const notasPorFecha = notas
      .sort((a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime())
      .reduce((acc, nota) => {
        const fecha = nota.fechaEntrega;
        if (!acc[fecha]) {
          acc[fecha] = [];
        }
        acc[fecha].push(nota.puntaje);
        return acc;
      }, {} as Record<string, number[]>);

    const datosLinea = Object.entries(notasPorFecha).map(([fecha, puntajes]) => ({
      fecha: new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      promedio: calcularPromedio(puntajes)
    }));

    // Distribución de calificaciones
    const distribucionNotas = notas.reduce((acc, nota) => {
      const tarea = tareas.find(t => t.id === nota.tareaId);
      if (tarea) {
        const porcentaje = Math.round((nota.puntaje / tarea.puntajeMaximo) * 100);
        let rango = '';
        if (porcentaje >= 90) rango = 'Excelente (90-100%)';
        else if (porcentaje >= 80) rango = 'Muy Bueno (80-89%)';
        else if (porcentaje >= 70) rango = 'Bueno (70-79%)';
        else if (porcentaje >= 60) rango = 'Regular (60-69%)';
        else rango = 'Deficiente (0-59%)';
        
        acc[rango] = (acc[rango] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const datosDistribucion = Object.entries(distribucionNotas).map(([rango, cantidad]) => ({
      name: rango,
      value: cantidad
    }));

    return {
      totales: { totalMaterias, totalTareas, totalNotas, totalEstudiantes },
      promedioGeneral,
      estadisticasPorMateria,
      datosBarras,
      datosCircular,
      datosLinea,
      datosDistribucion
    };
  }, [materias, tareas, notas, estudiantes]);

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Materias</p>
              <p className="text-2xl font-bold text-blue-900">{estadisticas.totales.totalMaterias}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Tareas</p>
              <p className="text-2xl font-bold text-green-900">{estadisticas.totales.totalTareas}</p>
            </div>
            <Award className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Notas</p>
              <p className="text-2xl font-bold text-purple-900">{estadisticas.totales.totalNotas}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Promedio General</p>
              <p className="text-2xl font-bold text-orange-900">{estadisticas.promedioGeneral.toFixed(1)}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Promedio por materia */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Promedio por Materia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadisticas.datosBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nombre" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" fill="#8884d8" name="Promedio" />
              <Bar dataKey="notaMaxima" fill="#82ca9d" name="Nota Máxima" />
              <Bar dataKey="notaMinima" fill="#ffc658" name="Nota Mínima" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico circular - Tipos de tareas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Tipos de Tareas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadisticas.datosCircular}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estadisticas.datosCircular.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de líneas - Tendencia temporal */}
        {estadisticas.datosLinea.length > 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendencia de Promedios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={estadisticas.datosLinea}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="promedio" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Promedio"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico circular - Distribución de calificaciones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Calificaciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadisticas.datosDistribucion}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estadisticas.datosDistribucion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de estadísticas detalladas por materia */}
      {estadisticas.estadisticasPorMateria.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Detalladas por Materia</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Materia
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Promedio
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Nota Máxima
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Nota Mínima
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Total Tareas
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Estudiantes
                  </th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.estadisticasPorMateria.map((est) => {
                  const materia = materias.find(m => m.id === est.materiaId);
                  return (
                    <tr key={est.materiaId} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${materia?.color || 'bg-gray-400'}`}></div>
                          <span className="font-medium text-gray-900">{est.nombreMateria}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <span className="font-semibold text-blue-600">{est.promedio.toFixed(1)}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <span className="font-semibold text-green-600">{est.notaMaxima}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <span className="font-semibold text-red-600">{est.notaMinima}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <span className="text-gray-700">{est.totalTareas}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <span className="text-gray-700">{est.totalEstudiantes}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
