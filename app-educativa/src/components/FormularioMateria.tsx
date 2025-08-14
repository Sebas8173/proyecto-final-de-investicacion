'use client';

import { useState, useEffect } from 'react';
import { Materia } from '@/types';
import { X, Save } from 'lucide-react';

interface FormularioMateriaProps {
  materia?: Materia;
  onSave: (materia: Omit<Materia, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const coloresDisponibles = [
  { nombre: 'Azul', clase: 'bg-blue-500', valor: 'bg-blue-500' },
  { nombre: 'Verde', clase: 'bg-green-500', valor: 'bg-green-500' },
  { nombre: 'Amarillo', clase: 'bg-yellow-500', valor: 'bg-yellow-500' },
  { nombre: 'Rojo', clase: 'bg-red-500', valor: 'bg-red-500' },
  { nombre: 'Morado', clase: 'bg-purple-500', valor: 'bg-purple-500' },
  { nombre: 'Rosa', clase: 'bg-pink-500', valor: 'bg-pink-500' },
  { nombre: 'Índigo', clase: 'bg-indigo-500', valor: 'bg-indigo-500' },
  { nombre: 'Teal', clase: 'bg-teal-500', valor: 'bg-teal-500' },
];

export default function FormularioMateria({ materia, onSave, onCancel, isOpen }: FormularioMateriaProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: 'bg-blue-500',
    fechaCreacion: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (materia) {
      setFormData({
        nombre: materia.nombre,
        descripcion: materia.descripcion,
        color: materia.color,
        fechaCreacion: materia.fechaCreacion
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        color: 'bg-blue-500',
        fechaCreacion: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [materia, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        color: formData.color,
        fechaCreacion: formData.fechaCreacion
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {materia ? 'Editar Materia' : 'Nueva Materia'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la materia *
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. Matemáticas, Historia, etc."
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe brevemente el contenido de la materia..."
            />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color identificador
            </label>
            <div className="grid grid-cols-4 gap-2">
              {coloresDisponibles.map((color) => (
                <button
                  key={color.valor}
                  type="button"
                  onClick={() => handleChange('color', color.valor)}
                  className={`w-full h-10 rounded-lg border-2 transition-all ${color.clase} ${
                    formData.color === color.valor 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title={color.nombre}
                />
              ))}
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
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={16} />
              {materia ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
