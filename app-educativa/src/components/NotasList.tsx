'use client';

import { useState } from 'react';
import { Nota, Tarea, Materia, Estudiante } from '@/types';
import { Trash2, Edit, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NotasListProps {
  notas: Nota[];
  tareas: Tarea[];
  materias: Materia[];
  estudiantes: Estudiante[];
  onEdit: (nota: Nota) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

export default function NotasList({ 
  notas, 
  tareas, 
  materias, 
  estudiantes, 
  onEdit, 
  onDelete, 
  onCreate 
}: NotasListProps) {
  const [filtroMateria, setFiltroMateria] = useState<number | null>(null);
  const [filtroTarea, setFiltroTarea] = useState<number | null>(null);
  const [filtroEstudiante, setFiltroEstudiante] = useState<number | null>(null);

  const getTareaById = (id: number) => tareas.find(t => t.id === id);
  const getMateriaById = (id: number) => materias.find(m => m.id === id);
  const getEstudianteById = (id: number) => estudiantes.find(e => e.id === id);

  const tareasFiltradas = tareas.filter(tarea => 
    filtroMateria === null || tarea.materiaId === filtroMateria
  );

  const notasFiltradas = notas.filter(nota => {
    const tarea = getTareaById(nota.tareaId);
    const cumpleFiltroMateria = filtroMateria === null || tarea?.materiaId === filtroMateria;
    const cumpleFiltroTarea = filtroTarea === null || nota.tareaId === filtroTarea;
    const cumpleFiltroEstudiante = filtroEstudiante === null || nota.estudianteId === filtroEstudiante;
    
    return cumpleFiltroMateria && cumpleFiltroTarea && cumpleFiltroEstudiante;
  });

  const calcularPorcentaje = (puntaje: number, puntajeMaximo: number) => {
    return Math.round((puntaje / puntajeMaximo) * 100);
  };

  const getColorNota = (porcentaje: number) => {
    if (porcentaje >= 80) return 'text-green-600';
    if (porcentaje >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIconoTendencia = (porcentaje: number) => {
    if (porcentaje >= 80) return <TrendingUp size={16} className="text-green-600" />;
    if (porcentaje >= 60) return <Minus size={16} className="text-yellow-600" />;
    return <TrendingDown size={16} className="text-red-600" />;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notas y Calificaciones</h2>
        <button
          onClick={onCreate}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nueva Nota
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por materia:
          </label>
          <select
            value={filtroMateria || ''}
            onChange={(e) => {
              const materiaId = e.target.value ? Number(e.target.value) : null;
              setFiltroMateria(materiaId);
              setFiltroTarea(null); // Reset filtro de tarea
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas las materias</option>
            {materias.map(materia => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por tarea:
          </label>
          <select
            value={filtroTarea || ''}
            onChange={(e) => setFiltroTarea(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas las tareas</option>
            {tareasFiltradas.map(tarea => (
              <option key={tarea.id} value={tarea.id}>
                {tarea.titulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por estudiante:
          </label>
          <select
            value={filtroEstudiante || ''}
            onChange={(e) => setFiltroEstudiante(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todos los estudiantes</option>
            {estudiantes.map(estudiante => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre} {estudiante.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de notas */}
      {notasFiltradas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Estudiante
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Tarea
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Materia
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Puntaje
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Porcentaje
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Fecha Entrega
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map((nota) => {
                const tarea = getTareaById(nota.tareaId);
                const materia = tarea ? getMateriaById(tarea.materiaId) : null;
                const porcentaje = tarea ? calcularPorcentaje(nota.puntaje, tarea.puntajeMaximo) : 0;
                
                return (
                  <tr key={nota.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="font-medium text-gray-900">{nota.nombreEstudiante}</div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="text-gray-900">{tarea?.titulo || 'Tarea no encontrada'}</div>
                      <div className="text-xs text-gray-500">{tarea?.tipo}</div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${materia?.color || 'bg-gray-400'}`}></div>
                        <span className="text-gray-900">{materia?.nombre || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <span className="font-semibold text-gray-900">
                        {nota.puntaje} / {tarea?.puntajeMaximo || 0}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getIconoTendencia(porcentaje)}
                        <span className={`font-semibold ${getColorNota(porcentaje)}`}>
                          {porcentaje}%
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                      {formatearFecha(nota.fechaEntrega)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(nota)}
                          className="p-1 text-purple-500 hover:bg-purple-50 rounded transition-colors"
                          title="Editar nota"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(nota.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar nota"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {notas.length === 0 
              ? 'No hay notas registradas'
              : 'No hay notas que coincidan con los filtros'
            }
          </p>
          {notas.length === 0 && (
            <button
              onClick={onCreate}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Registrar primera nota
            </button>
          )}
        </div>
      )}

      {/* Comentarios */}
      {notasFiltradas.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comentarios</h3>
          <div className="space-y-3">
            {notasFiltradas
              .filter(nota => nota.comentarios && nota.comentarios.trim())
              .map((nota) => {
                const tarea = getTareaById(nota.tareaId);
                return (
                  <div key={nota.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{nota.nombreEstudiante}</span>
                      <span className="text-sm text-gray-500">{tarea?.titulo}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{nota.comentarios}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
