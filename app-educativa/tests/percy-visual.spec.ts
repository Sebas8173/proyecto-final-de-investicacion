import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Pruebas Visuales Percy - App Educativa', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Percy - Vista principal de Materias', async ({ page }) => {
    await percySnapshot(page, 'Homepage - Vista Materias');
    
    // Hover estado
    await page.hover('button:has-text("Nueva Materia")');
    await percySnapshot(page, 'Homepage - Botón Hover Nueva Materia');
  });

  test('Percy - Vista de Tareas', async ({ page }) => {
    await page.click('button:has-text("Tareas")');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Vista Tareas - Estado Inicial');
    
    // Aplicar filtros
    await page.selectOption('select:near(label:has-text("Filtrar por materia"))', '1');
    await percySnapshot(page, 'Vista Tareas - Filtrado por Matemáticas');
  });

  test('Percy - Vista de Notas', async ({ page }) => {
    await page.click('button:has-text("Notas")');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Vista Notas - Tabla Completa');
    
    // Aplicar filtro de materia
    await page.selectOption('select:near(label:has-text("Filtrar por materia"))', '1');
    await percySnapshot(page, 'Vista Notas - Filtrado por Matemáticas');
  });

  test('Percy - Vista de Estadísticas', async ({ page }) => {
    await page.click('button:has-text("Estadísticas")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Esperar a que los gráficos se rendericen
    
    await percySnapshot(page, 'Vista Estadísticas - Gráficos Completos');
  });

  test('Percy - Formularios Modales', async ({ page }) => {
    // Formulario de Nueva Materia
    await page.click('button:has-text("Nueva Materia")');
    await percySnapshot(page, 'Modal - Formulario Nueva Materia');
    
    // Llenar datos válidos
    await page.fill('input[id="nombre"]', 'Química Avanzada');
    await page.fill('textarea[id="descripcion"]', 'Curso avanzado de química orgánica e inorgánica para estudiantes de nivel superior');
    await page.click('button[type="button"]:has([class*="bg-green-500"])'); // Seleccionar color verde
    await percySnapshot(page, 'Modal - Formulario Materia Completado');
    
    // Cerrar modal
    await page.click('button:has([class*="text-gray-400"])');
    
    // Formulario de Nueva Tarea
    await page.click('button:has-text("Tareas")');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Nueva Tarea")');
    await percySnapshot(page, 'Modal - Formulario Nueva Tarea');
  });

  test('Percy - Estados de Error y Validación', async ({ page }) => {
    // Abrir formulario y mostrar errores de validación
    await page.click('button:has-text("Nueva Materia")');
    await page.fill('input[id="nombre"]', 'A'); // Muy corto
    await page.fill('textarea[id="descripcion"]', 'Corto'); // Muy corto
    await page.click('button[type="submit"]');
    
    await percySnapshot(page, 'Modal - Errores de Validación');
  });

  test('Percy - Responsive Design', async ({ page }) => {
    // Vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await percySnapshot(page, 'Mobile - Vista Materias');
    
    await page.click('button:has-text("Tareas")');
    await page.waitForLoadState('networkidle');
    await percySnapshot(page, 'Mobile - Vista Tareas');
    
    await page.click('button:has-text("Notas")');
    await page.waitForLoadState('networkidle');
    await percySnapshot(page, 'Mobile - Vista Notas');
    
    // Vista tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await percySnapshot(page, 'Tablet - Vista Notas');
    
    await page.click('button:has-text("Estadísticas")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await percySnapshot(page, 'Tablet - Vista Estadísticas');
  });

  test('Percy - Diferentes Estados de Datos', async ({ page }) => {
    // Simular diferentes estados navegando y aplicando filtros
    
    // Estado con filtros aplicados en tareas
    await page.click('button:has-text("Tareas")');
    await page.waitForLoadState('networkidle');
    await page.selectOption('select:near(label:has-text("Filtrar por tipo"))', 'Examen');
    await percySnapshot(page, 'Vista Tareas - Solo Exámenes');
    
    // Estado con múltiples filtros en notas
    await page.click('button:has-text("Notas")');
    await page.waitForLoadState('networkidle');
    await page.selectOption('select:near(label:has-text("Filtrar por materia"))', '2');
    await page.selectOption('select:near(label:has-text("Filtrar por estudiante"))', '1');
    await percySnapshot(page, 'Vista Notas - Filtros Múltiples');
  });

});
