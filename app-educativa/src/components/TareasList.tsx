'use client';

import { useState } from 'react';
import { Tarea, Materia } from '@/types';
import { Trash2, Edit, Plus, Calendar, FileText, GraduationCap } from 'lucide-react';

interface TareasListProps {
  tareas: Tarea[];
  materias: Materia[];
  onEdit: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

const tipoIcons = {
  'Tarea': FileText,
  'Examen': GraduationCap,
  'Proyecto': FileText,
  'Quiz': FileText
};

const tipoColors = {
  'Tarea': 'bg-blue-100 text-blue-800',
  'Examen': 'bg-red-100 text-red-800',
  'Proyecto': 'bg-green-100 text-green-800',
  'Quiz': 'bg-yellow-100 text-yellow-800'
};

export default function TareasList({ tareas, materias, onEdit, onDelete, onCreate }: TareasListProps) {
  const [filtroMateria, setFiltroMateria] = useState<number | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);

  const getMateriaById = (id: number) => {
    return materias.find(m => m.id === id);
  };

  const tareasFiltradas = tareas.filter(tarea => {
    const cumpleFiltroMateria = filtroMateria === null || tarea.materiaId === filtroMateria;
    const cumpleFiltroTipo = filtroTipo === null || tarea.tipo === filtroTipo;
    return cumpleFiltroMateria && cumpleFiltroTipo;
  });

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const estaVencida = (fechaVencimiento: string) => {
    return new Date(fechaVencimiento) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tareas y Exámenes</h2>
        <button
          onClick={onCreate}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por materia:
          </label>
          <select
            value={filtroMateria || ''}
            onChange={(e) => setFiltroMateria(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            Filtrar por tipo:
          </label>
          <select
            value={filtroTipo || ''}
            onChange={(e) => setFiltroTipo(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los tipos</option>
            <option value="Tarea">Tarea</option>
            <option value="Examen">Examen</option>
            <option value="Proyecto">Proyecto</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {tareasFiltradas.map((tarea) => {
          const materia = getMateriaById(tarea.materiaId);
          const IconoTipo = tipoIcons[tarea.tipo];
          
          return (
            <div key={tarea.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <IconoTipo size={20} className="text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">{tarea.titulo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors[tarea.tipo]}`}>
                      {tarea.tipo}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{tarea.descripcion}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${materia?.color || 'bg-gray-400'}`}></div>
                      <span>{materia?.nombre || 'Materia no encontrada'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span className={estaVencida(tarea.fechaVencimiento) ? 'text-red-600 font-medium' : ''}>
                        Vence: {formatearFecha(tarea.fechaVencimiento)}
                      </span>
                    </div>
                    
                    <span>Puntos: {tarea.puntajeMaximo}</span>
                  </div>
                  
                  {estaVencida(tarea.fechaVencimiento) && (
                    <div className="mt-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        VENCIDA
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(tarea)}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar tarea"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(tarea.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar tarea"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {tareasFiltradas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {tareas.length === 0 
              ? 'No hay tareas registradas'
              : 'No hay tareas que coincidan con los filtros'
            }
          </p>
          {tareas.length === 0 && (
            <button
              onClick={onCreate}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Crear primera tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
}
