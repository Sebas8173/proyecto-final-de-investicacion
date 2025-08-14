'use client';

import { useState } from 'react';
import { Materia } from '@/types';
import { Trash2, Edit, Plus } from 'lucide-react';

interface MateriasListProps {
  materias: Materia[];
  onEdit: (materia: Materia) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

export default function MateriasList({ materias, onEdit, onDelete, onCreate }: MateriasListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Materias</h2>
        <button
          onClick={onCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nueva Materia
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materias.map((materia) => (
          <div key={materia.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className={`w-full h-2 ${materia.color} rounded-t-lg mb-3`}></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{materia.nombre}</h3>
            <p className="text-gray-600 text-sm mb-3">{materia.descripcion}</p>
            <p className="text-xs text-gray-500 mb-4">
              Creada: {new Date(materia.fechaCreacion).toLocaleDateString('es-ES')}
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(materia)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar materia"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(materia.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar materia"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {materias.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay materias registradas</p>
          <button
            onClick={onCreate}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Crear primera materia
          </button>
        </div>
      )}
    </div>
  );
}
