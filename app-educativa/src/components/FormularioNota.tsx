'use client';

import { useState, useEffect } from 'react';
import { Nota, Tarea, Materia, Estudiante } from '@/types';
import { X, Save } from 'lucide-react';

interface FormularioNotaProps {
  nota?: Nota;
  tareas: Tarea[];
  materias: Materia[];
  estudiantes: Estudiante[];
  onSave: (nota: Omit<Nota, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function FormularioNota({ 
  nota, 
  tareas, 
  materias, 
  estudiantes, 
  onSave, 
  onCancel, 
  isOpen 
}: FormularioNotaProps) {
  const [formData, setFormData] = useState({
    tareaId: 0,
    estudianteId: 0,
    nombreEstudiante: '',
    puntaje: 0,
    fechaEntrega: new Date().toISOString().split('T')[0],
    comentarios: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);

  useEffect(() => {
    if (nota) {
      setFormData({
        tareaId: nota.tareaId,
        estudianteId: nota.estudianteId,
        nombreEstudiante: nota.nombreEstudiante,
        puntaje: nota.puntaje,
        fechaEntrega: nota.fechaEntrega,
        comentarios: nota.comentarios || ''
      });
      const tarea = tareas.find(t => t.id === nota.tareaId);
      setTareaSeleccionada(tarea || null);
    } else {
      setFormData({
        tareaId: tareas.length > 0 ? tareas[0].id : 0,
        estudianteId: estudiantes.length > 0 ? estudiantes[0].id : 0,
        nombreEstudiante: estudiantes.length > 0 ? `${estudiantes[0].nombre} ${estudiantes[0].apellido}` : '',
        puntaje: 0,
        fechaEntrega: new Date().toISOString().split('T')[0],
        comentarios: ''
      });
      setTareaSeleccionada(tareas.length > 0 ? tareas[0] : null);
    }
    setErrors({});
  }, [nota, isOpen, tareas, estudiantes]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (formData.tareaId === 0 || !tareas.find(t => t.id === formData.tareaId)) {
      newErrors.tareaId = 'Debes seleccionar una tarea válida';
    }

    if (formData.estudianteId === 0 || !estudiantes.find(e => e.id === formData.estudianteId)) {
      newErrors.estudianteId = 'Debes seleccionar un estudiante válido';
    }

    if (formData.puntaje < 0) {
      newErrors.puntaje = 'El puntaje no puede ser negativo';
    } else if (tareaSeleccionada && formData.puntaje > tareaSeleccionada.puntajeMaximo) {
      newErrors.puntaje = `El puntaje no puede exceder ${tareaSeleccionada.puntajeMaximo} puntos`;
    }

    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        tareaId: formData.tareaId,
        estudianteId: formData.estudianteId,
        nombreEstudiante: formData.nombreEstudiante,
        puntaje: formData.puntaje,
        fechaEntrega: formData.fechaEntrega,
        comentarios: formData.comentarios.trim() || undefined
      });
    }
  };

  const handleTareaChange = (tareaId: number) => {
    const tarea = tareas.find(t => t.id === tareaId);
    setTareaSeleccionada(tarea || null);
    setFormData({ ...formData, tareaId, puntaje: 0 });
    if (errors.tareaId) {
      setErrors({ ...errors, tareaId: '' });
    }
  };

  const handleEstudianteChange = (estudianteId: number) => {
    const estudiante = estudiantes.find(e => e.id === estudianteId);
    const nombreCompleto = estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : '';
    setFormData({ 
      ...formData, 
      estudianteId, 
      nombreEstudiante: nombreCompleto 
    });
    if (errors.estudianteId) {
      setErrors({ ...errors, estudianteId: '' });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const calcularPorcentaje = () => {
    if (!tareaSeleccionada || tareaSeleccionada.puntajeMaximo === 0) return 0;
    return Math.round((formData.puntaje / tareaSeleccionada.puntajeMaximo) * 100);
  };

  const getColorPorcentaje = (porcentaje: number) => {
    if (porcentaje >= 80) return 'text-green-600';
    if (porcentaje >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  if (tareas.length === 0 || estudiantes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Faltan datos necesarios
            </h3>
            <p className="text-gray-600 mb-6">
              {tareas.length === 0 && estudiantes.length === 0 
                ? 'Necesitas crear al menos una tarea y un estudiante antes de poder registrar notas.'
                : tareas.length === 0 
                ? 'Necesitas crear al menos una tarea antes de poder registrar notas.'
                : 'Necesitas registrar al menos un estudiante antes de poder registrar notas.'
              }
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

  const porcentaje = calcularPorcentaje();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {nota ? 'Editar Nota' : 'Nueva Nota'}
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
              <label htmlFor="tareaId" className="block text-sm font-medium text-gray-700 mb-2">
                Tarea/Examen *
              </label>
              <select
                id="tareaId"
                value={formData.tareaId}
                onChange={(e) => handleTareaChange(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.tareaId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0}>Selecciona una tarea</option>
                {tareas.map(tarea => {
                  const materia = materias.find(m => m.id === tarea.materiaId);
                  return (
                    <option key={tarea.id} value={tarea.id}>
                      {tarea.titulo} - {materia?.nombre} ({tarea.tipo})
                    </option>
                  );
                })}
              </select>
              {errors.tareaId && <p className="text-red-500 text-xs mt-1">{errors.tareaId}</p>}
            </div>

            <div>
              <label htmlFor="estudianteId" className="block text-sm font-medium text-gray-700 mb-2">
                Estudiante *
              </label>
              <select
                id="estudianteId"
                value={formData.estudianteId}
                onChange={(e) => handleEstudianteChange(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.estudianteId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0}>Selecciona un estudiante</option>
                {estudiantes.map(estudiante => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre} {estudiante.apellido}
                  </option>
                ))}
              </select>
              {errors.estudianteId && <p className="text-red-500 text-xs mt-1">{errors.estudianteId}</p>}
            </div>
          </div>

          {tareaSeleccionada && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Información de la tarea:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Tipo:</span> {tareaSeleccionada.tipo}
                </div>
                <div>
                  <span className="font-medium">Puntaje máximo:</span> {tareaSeleccionada.puntajeMaximo}
                </div>
                <div>
                  <span className="font-medium">Vencimiento:</span>{' '}
                  {new Date(tareaSeleccionada.fechaVencimiento).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="puntaje" className="block text-sm font-medium text-gray-700 mb-2">
                Puntaje obtenido *
              </label>
              <input
                type="number"
                id="puntaje"
                value={formData.puntaje}
                onChange={(e) => handleChange('puntaje', Number(e.target.value))}
                min="0"
                max={tareaSeleccionada?.puntajeMaximo || 100}
                step="0.5"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.puntaje ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.puntaje && <p className="text-red-500 text-xs mt-1">{errors.puntaje}</p>}
              {tareaSeleccionada && formData.puntaje > 0 && (
                <p className={`text-xs mt-1 font-medium ${getColorPorcentaje(porcentaje)}`}>
                  Porcentaje: {porcentaje}% 
                  {porcentaje >= 60 ? ' (Aprobado)' : ' (Reprobado)'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fechaEntrega" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de entrega *
              </label>
              <input
                type="date"
                id="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={(e) => handleChange('fechaEntrega', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.fechaEntrega ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaEntrega && <p className="text-red-500 text-xs mt-1">{errors.fechaEntrega}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios (opcional)
            </label>
            <textarea
              id="comentarios"
              value={formData.comentarios}
              onChange={(e) => handleChange('comentarios', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Agrega comentarios sobre el desempeño del estudiante..."
            />
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
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={16} />
              {nota ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
