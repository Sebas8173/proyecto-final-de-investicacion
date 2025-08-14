import { test, expect } from '@playwright/test';

test.describe('Pruebas Visuales - App Educativa', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal antes de cada prueba
    await page.goto('/');
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('Vista principal - Materias', async ({ page }) => {
    // Verificar que estamos en la vista de materias por defecto
    await expect(page.locator('h2:has-text("Materias")')).toBeVisible();
    
    // Tomar captura de pantalla de la vista de materias
    await expect(page).toHaveScreenshot('vista-materias.png');
    
    // Verificar que hay materias cargadas
    await expect(page.locator('[class*="grid"] > div')).toHaveCount(4);
    
    // Tomar captura de una tarjeta de materia específica
    const primerMateria = page.locator('[class*="grid"] > div').first();
    await expect(primerMateria).toHaveScreenshot('tarjeta-materia.png');
  });

  test('Vista de Tareas', async ({ page }) => {
    // Navegar a la vista de tareas
    await page.click('button:has-text("Tareas")');
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la vista de tareas
    await expect(page.locator('h2:has-text("Tareas y Exámenes")')).toBeVisible();
    
    // Tomar captura de la vista completa de tareas
    await expect(page).toHaveScreenshot('vista-tareas.png');
    
    // Tomar captura de los filtros
    const filtros = page.locator('div:has(label:has-text("Filtrar por"))').first().locator('..');
    await expect(filtros).toHaveScreenshot('filtros-tareas.png');
    
    // Verificar una tarea específica
    const primerTarea = page.locator('[class*="space-y-4"] > div').first();
    await expect(primerTarea).toHaveScreenshot('tarjeta-tarea.png');
  });

  test('Vista de Notas', async ({ page }) => {
    // Navegar a la vista de notas
    await page.click('button:has-text("Notas")');
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la vista de notas
    await expect(page.locator('h2:has-text("Notas y Calificaciones")')).toBeVisible();
    
    // Tomar captura de la vista completa
    await expect(page).toHaveScreenshot('vista-notas.png');
    
    // Tomar captura de la tabla de notas
    const tabla = page.locator('table');
    await expect(tabla).toHaveScreenshot('tabla-notas.png');
  });

  test('Vista de Estadísticas', async ({ page }) => {
    // Navegar a la vista de estadísticas
    await page.click('button:has-text("Estadísticas")');
    await page.waitForLoadState('networkidle');
    
    // Esperar a que los gráficos se carguen
    await page.waitForTimeout(2000);
    
    // Tomar captura de la vista completa de estadísticas
    await expect(page).toHaveScreenshot('vista-estadisticas.png');
    
    // Tomar capturas de componentes específicos
    const tarjetasResumen = page.locator('[class*="grid"] > div:has([class*="bg-blue-50"], [class*="bg-green-50"], [class*="bg-purple-50"], [class*="bg-orange-50"])').first().locator('..');
    await expect(tarjetasResumen).toHaveScreenshot('tarjetas-resumen.png');
    
    // Captura del primer gráfico
    const primerGrafico = page.locator('[class*="bg-white"][class*="shadow-md"]').first();
    await expect(primerGrafico).toHaveScreenshot('grafico-barras.png');
  });

  test('Formulario de Nueva Materia', async ({ page }) => {
    // Abrir formulario de nueva materia
    await page.click('button:has-text("Nueva Materia")');
    
    // Esperar a que el modal aparezca
    await expect(page.locator('h3:has-text("Nueva Materia")')).toBeVisible();
    
    // Tomar captura del formulario vacío
    await expect(page.locator('[class*="fixed inset-0"]')).toHaveScreenshot('formulario-nueva-materia.png');
    
    // Llenar el formulario parcialmente para mostrar validación
    await page.fill('input[id="nombre"]', 'Test');
    await page.fill('textarea[id="descripcion"]', 'Descripción corta');
    
    // Intentar enviar para mostrar errores de validación
    await page.click('button[type="submit"]');
    
    // Tomar captura con errores de validación
    await expect(page.locator('[class*="fixed inset-0"]')).toHaveScreenshot('formulario-con-errores.png');
  });

  test('Responsividad - Mobile', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Tomar captura de la vista móvil de materias
    await expect(page).toHaveScreenshot('mobile-materias.png');
    
    // Navegar a tareas en móvil
    await page.click('button:has-text("Tareas")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-tareas.png');
    
    // Navegar a notas en móvil
    await page.click('button:has-text("Notas")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-notas.png');
  });

  test('Estados de interacción', async ({ page }) => {
    // Hover sobre botón de nueva materia
    await page.hover('button:has-text("Nueva Materia")');
    await expect(page.locator('button:has-text("Nueva Materia")')).toHaveScreenshot('boton-hover.png');
    
    // Hover sobre una tarjeta de materia
    const primerMateria = page.locator('[class*="grid"] > div').first();
    await primerMateria.hover();
    await expect(primerMateria).toHaveScreenshot('tarjeta-hover.png');
    
    // Focus en elementos del formulario
    await page.click('button:has-text("Nueva Materia")');
    await page.focus('input[id="nombre"]');
    await expect(page.locator('input[id="nombre"]')).toHaveScreenshot('input-focus.png');
  });

});
