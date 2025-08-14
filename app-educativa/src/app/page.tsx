'use client';

import { useState } from 'react';
import { Materia, Tarea, Nota, Estudiante } from '@/types';
import { materiasIniciales, tareasIniciales, notasIniciales, estudiantesIniciales } from '@/data/mockData';

// Componentes
import MateriasList from '@/components/MateriasList';
import FormularioMateria from '@/components/FormularioMateria';
import TareasList from '@/components/TareasList';
import FormularioTarea from '@/components/FormularioTarea';
import NotasList from '@/components/NotasList';
import FormularioNota from '@/components/FormularioNota';
import Estadisticas from '@/components/Estadisticas';

import { BookOpen, ClipboardList, GraduationCap, BarChart3 } from 'lucide-react';

type Vista = 'materias' | 'tareas' | 'notas' | 'estadisticas';

export default function Home() {
  const [vistaActiva, setVistaActiva] = useState<Vista>('materias');
  
  // Estados para los datos
  const [materias, setMaterias] = useState<Materia[]>(materiasIniciales);
  const [tareas, setTareas] = useState<Tarea[]>(tareasIniciales);
  const [notas, setNotas] = useState<Nota[]>(notasIniciales);
  const [estudiantes] = useState<Estudiante[]>(estudiantesIniciales);

  // Estados para los formularios
  const [formularioMateriaAbierto, setFormularioMateriaAbierto] = useState(false);
  const [materiaEditando, setMateriaEditando] = useState<Materia | undefined>();
  
  const [formularioTareaAbierto, setFormularioTareaAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | undefined>();
  
  const [formularioNotaAbierto, setFormularioNotaAbierto] = useState(false);
  const [notaEditando, setNotaEditando] = useState<Nota | undefined>();

  // Funciones para materias
  const handleCrearMateria = () => {
    setMateriaEditando(undefined);
    setFormularioMateriaAbierto(true);
  };

  const handleEditarMateria = (materia: Materia) => {
    setMateriaEditando(materia);
    setFormularioMateriaAbierto(true);
  };

  const handleGuardarMateria = (datosMateria: Omit<Materia, 'id'>) => {
    if (materiaEditando) {
      setMaterias(materias.map(m => 
        m.id === materiaEditando.id 
          ? { ...datosMateria, id: materiaEditando.id }
          : m
      ));
    } else {
      const nuevaMateria: Materia = {
        ...datosMateria,
        id: Math.max(...materias.map(m => m.id), 0) + 1
      };
      setMaterias([...materias, nuevaMateria]);
    }
    setFormularioMateriaAbierto(false);
    setMateriaEditando(undefined);
  };

  const handleEliminarMateria = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta materia? Se eliminarán también todas sus tareas y notas asociadas.')) {
      setMaterias(materias.filter(m => m.id !== id));
      setTareas(tareas.filter(t => t.materiaId !== id));
      const idsTageasEliminadas = tareas.filter(t => t.materiaId === id).map(t => t.id);
      setNotas(notas.filter(n => !idsTageasEliminadas.includes(n.tareaId)));
    }
  };

  // Funciones para tareas
  const handleCrearTarea = () => {
    setTareaEditando(undefined);
    setFormularioTareaAbierto(true);
  };

  const handleEditarTarea = (tarea: Tarea) => {
    setTareaEditando(tarea);
    setFormularioTareaAbierto(true);
  };

  const handleGuardarTarea = (datosTarea: Omit<Tarea, 'id'>) => {
    if (tareaEditando) {
      setTareas(tareas.map(t => 
        t.id === tareaEditando.id 
          ? { ...datosTarea, id: tareaEditando.id }
          : t
      ));
    } else {
      const nuevaTarea: Tarea = {
        ...datosTarea,
        id: Math.max(...tareas.map(t => t.id), 0) + 1
      };
      setTareas([...tareas, nuevaTarea]);
    }
    setFormularioTareaAbierto(false);
    setTareaEditando(undefined);
  };

  const handleEliminarTarea = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea? Se eliminarán también todas las notas asociadas.')) {
      setTareas(tareas.filter(t => t.id !== id));
      setNotas(notas.filter(n => n.tareaId !== id));
    }
  };

  // Funciones para notas
  const handleCrearNota = () => {
    setNotaEditando(undefined);
    setFormularioNotaAbierto(true);
  };

  const handleEditarNota = (nota: Nota) => {
    setNotaEditando(nota);
    setFormularioNotaAbierto(true);
  };

  const handleGuardarNota = (datosNota: Omit<Nota, 'id'>) => {
    if (notaEditando) {
      setNotas(notas.map(n => 
        n.id === notaEditando.id 
          ? { ...datosNota, id: notaEditando.id }
          : n
      ));
    } else {
      const nuevaNota: Nota = {
        ...datosNota,
        id: Math.max(...notas.map(n => n.id), 0) + 1
      };
      setNotas([...notas, nuevaNota]);
    }
    setFormularioNotaAbierto(false);
    setNotaEditando(undefined);
  };

  const handleEliminarNota = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotas(notas.filter(n => n.id !== id));
    }
  };

  const menuItems = [
    { id: 'materias' as const, nombre: 'Materias', icono: BookOpen, color: 'text-blue-600' },
    { id: 'tareas' as const, nombre: 'Tareas', icono: ClipboardList, color: 'text-green-600' },
    { id: 'notas' as const, nombre: 'Notas', icono: GraduationCap, color: 'text-purple-600' },
    { id: 'estadisticas' as const, nombre: 'Estadísticas', icono: BarChart3, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema Educativo</h1>
              <p className="text-gray-600">Gestión de materias, tareas y calificaciones</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación por pestañas */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {menuItems.map((item) => {
              const IconComponent = item.icono;
              return (
                <button
                  key={item.id}
                  onClick={() => setVistaActiva(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    vistaActiva === item.id
                      ? `${item.color} bg-opacity-10 border-b-2 border-current`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={20} />
                  {item.nombre}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido principal */}
        <main>
          {vistaActiva === 'materias' && (
            <MateriasList
              materias={materias}
              onEdit={handleEditarMateria}
              onDelete={handleEliminarMateria}
              onCreate={handleCrearMateria}
            />
          )}

          {vistaActiva === 'tareas' && (
            <TareasList
              tareas={tareas}
              materias={materias}
              onEdit={handleEditarTarea}
              onDelete={handleEliminarTarea}
              onCreate={handleCrearTarea}
            />
          )}

          {vistaActiva === 'notas' && (
            <NotasList
              notas={notas}
              tareas={tareas}
              materias={materias}
              estudiantes={estudiantes}
              onEdit={handleEditarNota}
              onDelete={handleEliminarNota}
              onCreate={handleCrearNota}
            />
          )}

          {vistaActiva === 'estadisticas' && (
            <Estadisticas
              materias={materias}
              tareas={tareas}
              notas={notas}
              estudiantes={estudiantes}
            />
          )}
        </main>
      </div>

      {/* Formularios modales */}
      <FormularioMateria
        materia={materiaEditando}
        onSave={handleGuardarMateria}
        onCancel={() => {
          setFormularioMateriaAbierto(false);
          setMateriaEditando(undefined);
        }}
        isOpen={formularioMateriaAbierto}
      />

      <FormularioTarea
        tarea={tareaEditando}
        materias={materias}
        onSave={handleGuardarTarea}
        onCancel={() => {
          setFormularioTareaAbierto(false);
          setTareaEditando(undefined);
        }}
        isOpen={formularioTareaAbierto}
      />

      <FormularioNota
        nota={notaEditando}
        tareas={tareas}
        materias={materias}
        estudiantes={estudiantes}
        onSave={handleGuardarNota}
        onCancel={() => {
          setFormularioNotaAbierto(false);
          setNotaEditando(undefined);
        }}
        isOpen={formularioNotaAbierto}
      />
    </div>
  );
}
