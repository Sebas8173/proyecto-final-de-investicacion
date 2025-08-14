'use client';

import { useState, useEffect } from 'react';
import { Tarea, Materia } from '@/types';
import { X, Save } from 'lucide-react';

interface FormularioTareaProps {
  tarea?: Tarea;
  materias: Materia[];
  onSave: (tarea: Omit<Tarea, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function FormularioTarea({ tarea, materias, onSave, onCancel, isOpen }: FormularioTareaProps) {
  const [formData, setFormData] = useState({
    materiaId: 0,
    titulo: '',
    descripcion: '',
    tipo: 'Tarea' as 'Tarea' | 'Examen' | 'Proyecto' | 'Quiz',
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    puntajeMaximo: 100
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (tarea) {
      setFormData({
        materiaId: tarea.materiaId,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        tipo: tarea.tipo,
        fechaCreacion: tarea.fechaCreacion,
        fechaVencimiento: tarea.fechaVencimiento,
        puntajeMaximo: tarea.puntajeMaximo
      });
    } else {
      const fechaActual = new Date();
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaActual.getDate() + 7); // 7 días por defecto
      
      setFormData({
        materiaId: materias.length > 0 ? materias[0].id : 0,
        titulo: '',
        descripcion: '',
        tipo: 'Tarea',
        fechaCreacion: fechaActual.toISOString().split('T')[0],
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        puntajeMaximo: 100
      });
    }
    setErrors({});
  }, [tarea, isOpen, materias]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (formData.materiaId === 0 || !materias.find(m => m.id === formData.materiaId)) {
      newErrors.materiaId = 'Debes seleccionar una materia válida';
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.trim().length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es obligatoria';
    } else {
      const fechaVencimiento = new Date(formData.fechaVencimiento);
      const fechaCreacion = new Date(formData.fechaCreacion);
      if (fechaVencimiento <= fechaCreacion) {
        newErrors.fechaVencimiento = 'La fecha de vencimiento debe ser posterior a la fecha de creación';
      }
    }

    if (formData.puntajeMaximo <= 0) {
      newErrors.puntajeMaximo = 'El puntaje máximo debe ser mayor a 0';
    } else if (formData.puntajeMaximo > 1000) {
      newErrors.puntajeMaximo = 'El puntaje máximo no puede exceder 1000 puntos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        materiaId: formData.materiaId,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        tipo: formData.tipo,
        fechaCreacion: formData.fechaCreacion,
        fechaVencimiento: formData.fechaVencimiento,
        puntajeMaximo: formData.puntajeMaximo
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!isOpen) return null;

  if (materias.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              No hay materias disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Necesitas crear al menos una materia antes de poder crear tareas.
            </p>
            <button
              onClick={onCancel}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="materiaId" className="block text-sm font-medium text-gray-700 mb-2">
                Materia *
              </label>
              <select
                id="materiaId"
                value={formData.materiaId}
                onChange={(e) => handleChange('materiaId', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.materiaId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0}>Selecciona una materia</option>
                {materias.map(materia => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
              {errors.materiaId && <p className="text-red-500 text-xs mt-1">{errors.materiaId}</p>}
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de evaluación *
              </label>
              <select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Tarea">Tarea</option>
                <option value="Examen">Examen</option>
                <option value="Proyecto">Proyecto</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.titulo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. Examen de álgebra, Tarea de geometría..."
            />
            {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe los temas que abarca esta evaluación..."
            />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="fechaCreacion" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de creación
              </label>
              <input
                type="date"
                id="fechaCreacion"
                value={formData.fechaCreacion}
                onChange={(e) => handleChange('fechaCreacion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de vencimiento *
              </label>
              <input
                type="date"
                id="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={(e) => handleChange('fechaVencimiento', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.fechaVencimiento ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaVencimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaVencimiento}</p>}
            </div>

            <div>
              <label htmlFor="puntajeMaximo" className="block text-sm font-medium text-gray-700 mb-2">
                Puntaje máximo *
              </label>
              <input
                type="number"
                id="puntajeMaximo"
                value={formData.puntajeMaximo}
                onChange={(e) => handleChange('puntajeMaximo', Number(e.target.value))}
                min="1"
                max="1000"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.puntajeMaximo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.puntajeMaximo && <p className="text-red-500 text-xs mt-1">{errors.puntajeMaximo}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={16} />
              {tarea ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
